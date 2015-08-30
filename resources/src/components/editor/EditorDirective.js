(function() {
    'use strict';

    angular.module('journal.component.editor')
        .directive('checkPostSlug', ['$timeout', 'EditorService', CheckPostSlug])
        .directive('tagInput', ['EditorService', TagInput]);

    function CheckPostSlug($timeout, EditorService) {
        return {
            require : 'ngModel',
            scope : {
                ngModel : '=',
                slug : '=',
                postId : '='
            },
            link : function(scope, element, attribute, ngModel) {
                element.on('blur', function() {
                    var title = ngModel.$modelValue;

                    // check first if title is set or not empty
                    if (!title || title.length == 0) {
                        return;
                    }

                    // do an API request to check if the slug to be generated is valid
                    EditorService.checkSlug(title, scope.postId)
                        .success(function(response) {
                            if (response.slug) {
                                $timeout(function() {
                                    scope.slug = response.slug;
                                });
                            }
                        })
                        .error(function(response) {
                            // TODO:show error via growl
                        });
                });
            }
        }
    }

    function TagInput(EditorService) {
        return {
            restrict: 'E',
            templateUrl: '/assets/templates/editor/tags.html',
            scope: {
                postTags: '=tags'
            },
            link: function (scope, element, attrs) {
                scope.inputtedTag       = '';
                scope.journalTags       = [];
                scope.suggestedTags     = [];
                scope.tags              = [];
                scope.showSuggestions   = false;

                /**
                 * Handles the click event when the user wants the suggested tag
                 * to be added as tag for the post
                 * @param tag
                 */
                scope.addTag = function(tag) {
                    // add the tag
                    scope.addToPostTag(tag);
                };

                /**
                 * Adds the tag to the array of post tags
                 * @param tag
                 */
                scope.addToPostTag = function(tag) {
                    // check first if tag already exists
                    for (var t in scope.postTags) {
                        if (scope.postTags[t].name == tag) {
                            return;
                        }
                    }

                    // hide the suggestion box
                    scope.showSuggestions   = false;

                    // add the tag
                    scope.postTags.push({ name : tag });
                    // empty the inputTag scope
                    scope.inputtedTag = '';

                    // fix the suggestion tags
                    scope.setupSuggestionTags();
                };

                /**
                 * This will run once the page/directive loads. Fetches the tags
                 * from the API and will cross reference the tags and determines
                 * which will be shown as suggestion tags.
                 */
                scope.initialize = function() {
                    EditorService.getTags()
                        .success(function(response) {
                            if (response.tags) {
                                // for storage
                                scope.journalTags = response.tags;

                                // check the tags between the tags from the post and
                                // tags from journal
                                scope.setupSuggestionTags();
                            }
                        });
                };

                /**
                 * Handles the the keypress event. As the user types, whatever the
                 * user is inputted, it will render suggested tags based on it. It
                 * also adds the inputted word to the post tags once the user pressed
                 * the 'Enter' key
                 * @param event
                 */
                scope.inputYourTag = function(event) {
                    scope.showSuggestions = true;

                    console.log(scope.suggestedTags.length);

                    // user pressed the 'Enter' key and assuming that the user
                    // inputted something in the scope
                    if (event.which == 13) {
                        event.preventDefault();

                        if (scope.inputtedTag.length > 0) {
                            // add the tag
                            scope.addToPostTag(scope.inputtedTag);
                        }
                    }

                    // input is empty
                    if (scope.inputtedTag.length < 0) {
                        // close the suggestions
                        scope.showSuggestions = false;
                    }
                };

                /**
                 * Fixes the tags to be suggested
                 */
                scope.setupSuggestionTags = function() {
                    scope.suggestedTags = scope.journalTags;

                    if (!scope.postTags) {
                        return;
                    }

                    // loop the post tags
                    for (var p in scope.postTags) {
                        // loop the suggested tags
                        for (var s in scope.suggestedTags) {
                            // check the tags in they are the same
                            if (scope.postTags[p].name == scope.suggestedTags[s].name) {
                                // remove it from the array
                                scope.suggestedTags.splice(s, 1);
                            }
                        }
                    }

                    return;
                };

                /**
                 * Removes a specific post tag
                 * @param tag
                 */
                scope.removePostTag = function(tag) {
                    var index = scope.postTags.indexOf(tag);
                    scope.postTags.splice(index, 1);

                    // return to the suggested tags
                    scope.suggestedTags.push(tag);
                };

                // fire away
                scope.initialize();
            }
        }
    }
})();