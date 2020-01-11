"use strict";

const languageJson = {
    en: {
        translation: {
            WELCOME_MSG: "Welcome, I'm EMMA. Please tell me what you want me to analyse!",
            HELP_MSG: "Please ask me something you want me to analyse.",
            GOODBYE_MSG: "Goodbye!",
            FALLBACK_MSG: "Sorry, I don't know about that. Please try again.",
            ERROR_MSG: "Sorry, I had trouble doing what you asked. Please try again.",
            DIDNT_UNDERSTAND: "Excuse me?",
            POSITIVE: "What you said seems postive to me.",
            NEGATIVE: "Unfortunately what you said seems negative to me.",
            POSITIVE_PERCENTAGE: "My calculations returned a positive value of $percentage",
            NEUTRAL_PERCENTAGE: "My calculations returned a neutral value of $percentage",
            NEGATIVE_PERCENTAGE: "My calculations returned a negative value of just $percentage"
        }
    },
    de: {
        translation: {
            WELCOME_MSG: "Willkommen, ich bin EMMA. Bitte sag mir was du analysiert haben möchtest",
            HELP_MSG: "Sag mir etwas was du gerne analysiert hättest",
            GOODBYE_MSG: "Tschüss!",
            FALLBACK_MSG: "Es tut mir leid, ich weiss das nicht. Bitte versuche es erneut.",
            ERROR_MSG: "Entschuldigung, ich konnte leider nicht machen worum du mich gebeten hast.",
            DIDNT_UNDERSTAND: "Wie Bitte?",
            POSITIVE: "Das was du gesagt hast wirkt positiv auf mich!",
            NEGATIVE: "Das was du gesagt hast wirkt leider negativ auf mich!",
            POSITIVE_PERCENTAGE: "Meine Berechnungen haben einen positiven Wert von $percentage ergeben.",
            NEUTRAL_PERCENTAGE: "Meine Berechnungen haben einen neutralen Wert von $percentage ergeben.",
            NEGATIVE_PERCENTAGE: "Meine Berechnungen haben einen negativen Wert von nur $percentage ergeben."
        }
    }
};

module.exports.getString = function getString(language){
    switch(language){
        case "de-DE": return languageJson.de;
        case "en-US": return languageJson.en;
        default: return languageJson.en;
    }
};

module.exports.getEmotionTone = function getEmotionTone(language, emotionsTone){
    const emotionsToneUpper = emotionsTone.toUpperCase();
    switch(emotionsToneUpper){
        case "POSITIVE": return language.POSITIVE;
        case "NEUTRAL": return language.NEUTRAL;
        case "NEGATIVE": return language.NEGATIVE;
        default: return "not found!";
    }
};

module.exports.getEmotionPercentage = function getEmotionPercentage(language, emotionsTone, emotionPercentage){
    const emotionsToneUpper = emotionsTone.toUpperCase();
    switch(emotionsToneUpper){
        case "POSITIVE": return language.POSITIVE_PERCENTAGE.replace("$percentage", emotionPercentage);
        case "NEUTRAL": return language.NEUTRAL_PERCENTAGE.replace("$percentage", emotionPercentage);
        case "NEGATIVE": return language.NEGATIVE_PERCENTAGE.replace("$percentage", emotionPercentage);
        default: return "not found!";
    }
};
