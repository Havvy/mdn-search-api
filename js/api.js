"use strict";

const baseUrl = "https://developer.mozilla.org/en-US/search.json";

const Builder = function () {
    const builder = Object.create(Builder.prototype);
    builder.buildData = {
        query: null,
        locale: null,
        css_classnames: new Set(),
        html_attributes: new Set(),
        kumascript_macros: new Set(),
        highlight: true,
        page: 1,
        response: "json",
        topics: new Set(),
        skills: new Set(),
        types: new Set()
    };
    return builder;
};

Builder.prototype = {
    // Note(Havvy): Usually not good to rely on this
    //              but might as well leave it.
    constructor: Builder,

    query (queryString) {
        this.buildData.query = queryString;
        return this;
    },

    clearQuery () {
        this.buildData.query = null;
        return this;
    },

    locale (locale) {
        this.buildData.locale = locale;
        return this;
    },

    clearLocale () {
        this.buildData.locale = null;
        return this;
    },

    highlight () {
        this.buildData.highlight = true;
        return this;
    },

    clearHighlight () {
        this.buildData.highlight = false;
        return this;
    },

    addCssClassname (classname) {
        this.buildData.css_classnames.add(classname);
        return this;
    },

    removeCssClassname (classname) {
        this.buildData.css_classnames.delete(classname);
        return this;
    },

    addHtmlAttribute (attribute) {
        this.buildData.html_attributes.add(attribute);
        return this;
    },

    removeHtmlAttribute (attribute) {
        this.buildData.html_attributes.delete(attribute);
        return this;
    },

    addKumascriptMacro (macro) {
        this.buildData.kumascript_macros.add(macro);
        return this;
    },

    removeKumascriptMacro (macro) {
        this.buildData.kumascript_macros.delete(macro);
        return this;
    },

    addTopic (topic) {
        this.buildData.topics.add(topic);
        return this;
    },

    removeTopic (topic) {
        this.buildData.topics.delete(topic);
        return this;
    },

    addSkill (skill) {
        this.buildData.skills.add(skill);
        return this;
    },

    removeSkill (skill) {
        this.buildData.skills.delete(skill);
        return this;
    },

    addType (type) {
        this.buildData.types.add(type);
        return this;
    },

    removeType (type) {
        this.buildData.types.delete(type);
        return this;
    },

    page (page) {
        this.buildData.page = page;
        return this;
    },

    previousPage () {
        this.buildData.page -= 1;
        return this;
    },

    nextPage () {
        this.buildData.page += 1;
        return this;
    },

    htmlResponse () {
        this.buildData.response = "html";
        return this;
    },

    jsonResponse () {
        this.buildData.response = "json";
        return this;
    },

    buildQueryParams () {
        // Begin initializing queryParams array
        const queryParams = [];

        if (this.buildData.query !== null) {
            queryParams.push(["q", encodeURIComponent(this.buildData.query)]);
        }

        if (this.buildData.locale !== null) {
            queryParams.push(["locale", encodeURIComponent(this.buildData.locale)]);
        }

        this.buildData.css_classnames.forEach(function (classname) {
            queryParams.push(["css_classnames", encodeURIComponent(classname)]);
        });

        this.buildData.html_attributes.forEach(function (attribute) {
            queryParams.push(["html_attributes", encodeURIComponent(attribute)]);
        });

        this.buildData.kumascript_macros.forEach(function (macro) {
            queryParams.push(["kumascript_macros", encodeURIComponent(macro)]);
        });

        this.buildData.topics.forEach(function (macro) {
            queryParams.push(["topic", encodeURIComponent(macro)]);
        });

        this.buildData.skills.forEach(function (macro) {
            queryParams.push(["skill", encodeURIComponent(macro)]);
        });

        this.buildData.types.forEach(function (macro) {
            queryParams.push(["type", encodeURIComponent(macro)]);
        });

        if (!this.buildData.highlight) {
            queryParams.push(["highlight", "false"]);
        }

        if (this.buildData.page > 1) {
            queryParams.push(["page", String(this.buildData.page)]);
        }

        return queryParams;
    },

    buildBaseUrl () {
        return this.buildData.response === "json" ? baseUrl : baseUrl.slice(0, -5);
    },

    build () {
        function queryParamsString(queryParams) {
            return "?" + queryParams.map(function (param) {
                return param[0] + "=" + param[1];
            }).join("&");
        }

        const queryParams = this.buildQueryParams();

        if (queryParams.length === 0) {
            return this.buildBaseUrl();
        } else {
            return this.buildBaseUrl() + queryParamsString(queryParams);
        }
    }
};

const responseIsValid = function (response) {
    return !("detail" in response);
}

function SearchResponse (response) {
    if (!responseIsValid(response)) {
        throw new Error("MDN search request was malformed. Reason: " + response.detail);
    }

    const searchResponse = Object.create(SearchResponse.prototype);
    searchResponse.response = response;
    return searchResponse;
}

SearchResponse.prototype = {
    constructor: SearchResponse,

    firstResult () {
        return this.response.documents[0] || null;
    }
}

module.exports = {
    Builder,
    SearchResponse,
    responseIsValid
}