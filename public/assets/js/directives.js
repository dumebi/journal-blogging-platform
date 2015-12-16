(function() {
    'use strict';

    angular.module('journal.components.sidebar')
        .directive('journalSidebar', [SidebarDirective]);

    function SidebarDirective() {
        return {
            restrict : 'E',
            templateUrl : '/assets/templates/sidebar/sidebar-directive.html',
            replace: true,
            link : function(scope, element, attributes) {

            }
        }
    }
})();
(function() {
    'use strict';

    angular.module('journal.shared.markdownReader')
        .directive('journalMarkdown', ['MarkdownReader', JournalMarkdown]);

    function JournalMarkdown(MarkdownReader) {
        return {
            restrict : 'AE',
            scope : {
                journalMarkdown : '=',
                counter : '='
            },
            link : function(scope, element, attributes) {
                var countWords = function() {
                    var wordCount = 0;
                    // trim first the content
                    var trimmedContent = element.text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');

                    // check if there is content
                    if (trimmedContent.length > 0) {
                        wordCount = trimmedContent.match(/[^\s]+/g).length;
                    }

                    scope.counter = wordCount;
                };

                if (attributes.journalMarkdown) {
                    scope.$watch('journalMarkdown', function(value) {
                        var html = value ? MarkdownReader.makeHtml(value) : '';

                        if (attributes.hideScriptIframe) {
                            // replace the scripts and iframes
                            html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                                '<div class="embedded-javascript">Embedded JavaScript</div>');
                            html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
                                '<div class="embedded-iframe">Embedded iFrame</div>');
                        }

                        element.html(html);
                        countWords();
                    });
                } else {
                    var html = MarkdownReader.makeHtml(element.text());

                    if (attributes.hideScriptIframe) {
                        // replace the scripts and iframes
                        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                            '<div class="embedded-javascript">Embedded JavaScript</div>');
                        html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
                            '<div class="embedded-iframe">Embedded iFrame</div>');
                    }

                    element.html(html);
                    countWords();
                }
            }
        }
    }
})();