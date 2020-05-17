'use babel';

import JaroWinkler from './jaro-winkler';

/**
 * The spell checker interface for the custom plugin
 */
export default class CustomChecker {
    constructor(environment) {
        console.log('custom general language checker constructed ', this.getPluginName())

        let data = require("../data/dictionary.json");

        this.jaroWinkler = new JaroWinkler();
        this.listOfKnownWords = data.dictionary || [];
    }

    /**
     * Gives a list of file scopes to be covered by the plugin.
     * @return {string[]} Atom scope names. Ex.:source.js, text.html.basic, etc. Leave empty if the scope could be any.
     */
    getScopes() {
        return [];
    }

    /**
     * returns the name of the plugin/module so the spell checker module can identify this plugin
     * @return {string}
     */
    getPluginName() {
        return 'spell-checker-improved-plugin-general-lang';
    }

    /**
     * Called every time that a word was considered misspelled by the default spell checker or other plugins
     * @param  {string} wordToCheck
     * @return {boolean} boolean true if word is fine, false if not
     */
    onCheckWord(wordToCheck) {
        return this.listOfKnownWords.indexOf(wordToCheck.toLowerCase()) >= 0;
    }

    /**
     * Called every time the user requests for suggestions of a specific misspelled word
     * @param  {string} wordThatNeedsSuggestions
     * @return {string[]} list of suggested words for the parameter word
     */
    onGetSuggestions(wordThatNeedsSuggestions) {
        return this.listOfKnownWords.filter(
            knownWord => this.jaroWinkler.getDistance(wordThatNeedsSuggestions, knownWord) >= 0.9
        );
    }
}
