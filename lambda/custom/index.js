"use strict";

const Alexa = require("ask-sdk-core");
const languageStrings = require("./languageStrings");

const getRemoteData = function(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https") ? require("https") : require("http");
        const request = client.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error("Failed with status code: " + response.statusCode));
            }
            const body = [];
            response.on("data", (chunk) => body.push(chunk));
            response.on("end", () => resolve(body.join("")));
        });
        request.on("error", (err) => reject(err));
    });
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "LaunchRequest";
    },
    handle(handlerInput) {
        const language = languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation;
        const speechText = language.WELCOME_MSG;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard("EMMA", speechText)
            .getResponse();
    },
};

const AnswerHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "AnswerIntent";
    },
    async handle(handlerInput) {
        const language = languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation;
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const text = slots.textAnswer.value;
        let outputSpeech = language.DIDNT_UNDERSTAND;

        await getRemoteData("https://emma-ai.com/api/?text=" + `${text}`)
            .then((response) => {
                const data = JSON.parse(response);
                outputSpeech = languageStrings.getEmotionTone(language, data.emotion_tone) + " \n" +
                    languageStrings.getEmotionPercentage(language, data.emotion_tone, data.emotion_percentage);
            })
            .catch((err) => {
                outputSpeech = err.message;
            });

        return handlerInput.responseBuilder
            .speak(outputSpeech)
            .withSimpleCard("EMMA", outputSpeech)
            .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent";
    },
    handle(handlerInput) {
        const language = languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation;
        const speechText = language.HELP_MSG;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard("Emma", speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
        && (handlerInput.requestEnvelope.request.intent.name === "AMAZON.CancelIntent"
            || handlerInput.requestEnvelope.request.intent.name === "AMAZON.StopIntent");
    },
    handle(handlerInput) {
        const language = languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation;
        const speechText = language.GOODBYE_MSG;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard("Emma", speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak(languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation.FALLBACK_MSG)
            .reprompt(languageStrings.getString(handlerInput.requestEnvelope.request.locale).translation.FALLBACK_MSG)
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
