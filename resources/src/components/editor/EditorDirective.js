(function() {
    'use strict';

    angular.module('journal.components.editor')
        .directive('editorScroll', [EditorScroller])
        .directive('editorPublishButtons', ['CONFIG', EditorPublishButtons])
        .directive('inputPostSlug', [InputPostSlug])
        .directive('editorSidebar', ['CONFIG', EditorSidebar])
        .directive('featuredImage', ['CONFIG', FeaturedImage])
        .directive('editorTags', ['CONFIG', EditorTags]);

    /**
     * Enables both editor windows to scroll in sync.
     *
     * @returns {{restrict: string, link: Function}}
     * @constructor
     */
    function EditorScroller() {
        return {
            restrict : 'C',
            link : function() {
                angular
                    .element(document.getElementsByClassName('CodeMirror-scroll')[0])
                    .on('scroll', function(event) {
                        var editor = angular.element(event.target),
                            previewContent = angular.element(
                                document.getElementsByClassName('preview-wrapper')),
                            sizer = angular.element(
                                document.getElementsByClassName('CodeMirror-sizer')),
                            renderedMarkdown = angular.element(
                                document.getElementsByClassName('rendered-markdown')),
                            editorDifference = sizer[0].offsetHeight - editor[0].offsetHeight,
                            previewDifference = renderedMarkdown[0].offsetHeight - previewContent[0].offsetHeight,
                            quotient = previewDifference / editorDifference,
                            scroll = editor[0].scrollTop * quotient;

                        previewContent[0].scrollTop = scroll;
                    });
            }
        }
    }

    /**
     * Controls and sets the options to be shown on changing the post status
     * and the status indicator for the post.
     *
     * @returns {{require: string, restrict: string, replace: boolean, scope: {postStatus: string}, templateUrl: string, controllerAs: string, controller: *[], link: Function}}
     * @constructor
     */
    function EditorPublishButtons(CONFIG) {
        return {
            require : 'ngModel',
            restrict : 'EA',
            replace : true,
            scope : {
                ngModel     : '=ngModel',
                post        : '=post',
                processing  : '=processing'
            },
            templateUrl : CONFIG.TEMPLATE_PATH + 'editor/_editor-publish-buttons.html',
            controllerAs : 'epb',
            controller : ['$scope', function($scope) {
                var vm = this;

                // scope variables
                vm.options = {
                    status : 2,
                    active : [],
                    buttons : [
                        { class : 'btn-danger', group : 1, status : 1, text : 'Publish Now' },
                        { class : 'btn-primary', group : 1, status : 2, text : 'Save as Draft' },
                        { class : 'btn-danger', group : 2, status : 2, text : 'Unpublish Post' },
                        { class : 'btn-info', group : 2, status : 1, text : 'Update Post' }]
                };

                vm.processing = false;

                /**
                 * Set the status of the post.
                 * @param option
                 */
                vm.selectPostStatus = function(option) {
                    vm.options.active = option;

                    // set post status
                    vm.options.status = vm.options.active.status;
                    // update ng-model
                    $scope.ngModel = vm.options.status;
                };

                /**
                 * Set the options and state of the buttons.
                 * @param status
                 */
                vm.setButtons = function(status) {
                    // we're going to assume that status is published.
                    var selectedOption = vm.options.buttons[3];

                    // check if the post status is draft
                    if (status == 2) {
                        selectedOption = vm.options.buttons[1];
                    }

                    // set the button option
                    vm.options.active = selectedOption;
                };
            }],
            link : function(scope, element, attributes) {
                scope.$watch('post', function(post) {
                    // set button
                    scope.epb.setButtons(post.status);
                });

                scope.$watch('processing', function(processing) {
                    scope.epb.processing = processing;
                });
            }
        }
    }

    /**
     * Generates slug based on the post title inputted.
     *
     * @returns {{require: string, restrict: string, scope: {title: string, postId: string, slug: string}, controllerAs: string, controller: *[], link: Function}}
     * @constructor
     */
    function InputPostSlug() {
        return {
            require : 'ngModel',
            restrict : 'C',
            scope : {
                title   : '=ngModel',
                postId  : '=postId',
                slug    : '=slug'
            },
            controllerAs : 'ips',
            controller : ['$scope', 'EditorService', function($scope, EditorService) {
                var vm = this;

                /**
                 * Sends a request to the API to generate the slug based on the
                 * given title of the post.
                 *
                 * @param title
                 * @param id
                 */
                vm.checkPostTitle = function(title, id) {
                    EditorService.getSlug(title, id).then(function(response) {
                        if (response.slug) {
                            // update the slug scope
                            $scope.slug = response.slug;
                        }
                    }, function(error) {
                        // TODO: handle error
                    });
                };
            }],
            link : function(scope, element, attributes, ngModel) {
                // check for if the element triggers a blur event
                element.on('blur', function() {
                    // get the value of the input
                    var title = ngModel.$modelValue;

                    // check first if title is set or not empty
                    if (!title || title.length == 0) {
                        return;
                    }

                    // generate slug
                    scope.ips.checkPostTitle(title, scope.postId);
                });
            }
        }
    }

    /**
     * Sidebar directive for the Editor.
     *
     * @returns {{restrict: string, scope: {toggle: string, postData: string}, replace: boolean, templateUrl: string, controllerAs: string, controller: *[], link: Function}}
     * @constructor
     */
    function EditorSidebar(CONFIG) {
        return {
            restrict : 'EA',
            scope : {
                toggle      : '=toggle',
                postData    : '=post'
            },
            replace : true,
            templateUrl : CONFIG.TEMPLATE_PATH + 'editor/_editor-sidebar.html',
            controllerAs : 'es',
            controller : ['$scope', function($scope) {
                var vm = this;

                // scope variables
                vm.toggle   = false;
                vm.post     = [];
                vm.siteUrl  = window.location.origin;

                /**
                 * Closes the sidebar.
                 */
                vm.closeSidebar = function() {
                    // close the sidebar
                    vm.toggle = false;
                    // update the scope
                    $scope.toggle = false;
                };

                /**
                 * Listen for changes in the vm.post object so we can update
                 * the scope post.
                 */
                $scope.$watchCollection(function() {
                    return vm.post;
                }, function(post) {
                    // update the scope post
                    $scope.post = post;
                });
            }],
            link : function(scope, element, attributes) {
                // check for the scope post
                scope.$watch('postData', function(post) {
                    // assign to the controller variable
                    scope.es.post = post;
                });

                // check for the scope toggle
                scope.$watch('toggle', function(toggle) {
                    scope.es.toggle = toggle;
                });
            }
        }
    }

    /**
     * Featured image uploader or setter for the post.
     *
     * @returns {{restrict: string, require: string, scope: {featuredImage: string}, replace: boolean, templateUrl: string, controllerAs: string, controller: *[], link: Function}}
     * @constructor
     */
    function FeaturedImage(CONFIG) {
        return {
            restrict : 'EA',
            require : 'ngModel',
            scope : {
                featuredImage : '=ngModel'
            },
            replace: true,
            templateUrl : CONFIG.TEMPLATE_PATH + 'editor/_featured-image.html',
            controllerAs : 'fi',
            controller : ['$scope', '$timeout', 'FileUploaderService', 'ToastrService',
                function($scope, $timeout, FileUploaderService, ToastrService) {
                var vm = this;

                // scope controller variables
                vm.image = {
                    link : null,
                    file : null,
                    option : 'file',
                    url : ''
                };

                vm.processing = false;

                // upload variables
                vm.upload = {
                    active : false,
                    percentage : 0
                };

                /**
                 * Fetches the value of the input and be used as image url.
                 */
                vm.getImageLink = function() {
                    // delay it for a second
                    $timeout(function() {
                        vm.image.url = vm.image.link;
                        // update the scope
                        $scope.featuredImage = vm.image.url;

                        // empty the image link
                        vm.image.link = null;
                    }, 1000);
                };

                /**
                 * Removes the image.
                 */
                vm.removeImage = function() {
                    // empty the image url
                    vm.image.url = '';
                };

                /**
                 * Switches the option to put a featured image.
                 */
                vm.switchOption = function() {
                    if (vm.image.option == 'file') {
                        vm.image.option = 'link';
                        return;
                    }

                    if (vm.image.option == 'link') {
                        vm.image.option = 'file';
                        return;
                    }
                };

                /**
                 * Watches the change in the scope variable which will trigger
                 * the upload to the server side.
                 */
                $scope.$watch(function() {
                    return vm.image.file;
                }, function(file) {
                    if (file) {
                        // upload
                        FileUploaderService.upload(file)
                            .progress(function(event) {
                                vm.upload = {
                                    active : true,
                                    percentage : parseInt(100.0 * event.loaded / event.total)
                                };
                            })
                            .success(function(response) {
                                if (response.url) {
                                    // show image
                                    vm.image.url = response.url;

                                    // attach to the ng-model
                                    $scope.featuredImage = vm.image.url;

                                    // hide the progress bar
                                    vm.upload = {
                                        active : false,
                                        percentage : 0
                                    };
                                }
                            })
                            .error(function() {
                                // handle the error
                                ToastrService
                                    .toast('Something went wrong with the upload. Please try again later.', 'error');

                                // hide progress bar
                                vm.upload = {
                                    active : false,
                                    percentage : 0
                                };
                            });
                    }
                });
            }],
            link : function(scope, element, attributes, ngModel) {
                scope.$watch('featuredImage', function(imageUrl) {
                    scope.fi.image.url = imageUrl;
                });
            }
        }
    }

    function EditorTags(CONFIG) {
        return {
            restrict : 'EA',
            require : 'ngModel',
            scope : {
                tags : '=ngModel'
            },
            replace : true,
            controllerAs : 'et',
            controller : ['$scope', 'EditorService', function($scope, EditorService) {
                var vm = this;

                // controller variables
                vm.removingLastTag  = false;
                vm.postTags         = {};
                vm.query            = null;

                /**
                 * Validates the typed/selected tag if it already exists as
                 * one of the post tags but if the tag doesn't exists, it will
                 * be added as one of the post tags.
                 */
                vm.addToPostTags = function() {
                    var tag = vm.query;

                    // check if there's a tag
                    if (!tag || tag.length === 0) { return; }

                    // check first if tag already exists
                    for (var t in vm.postTags) {
                        // tag already exists
                        if (vm.postTags[t].name == tag) {
                            return;
                        }
                    }

                    // add the tag
                    vm.postTags.push({ name : tag });

                    // empty the input
                    vm.query = null;

                    // update the ng-model
                    $scope.tags = vm.postTags;
                };

                vm.initialize = function() {

                };

                vm.removeLastTag = function() {
                    // check first if the query scope is not empty
                    if ((vm.query && vm.query.length !== 0) || vm.postTags.length === 0) {
                        return;
                    }

                    // check first if the tag is ready to be removed
                    if (vm.removingLastTag) {
                        // get the index of the last
                        var index = vm.postTags.length - 1;

                        // remove it from the array
                        vm.postTags.splice(index, 1);

                        // update the ng-model
                        $scope.tags = vm.postTags;

                        // reset
                        vm.removingLastTag = false;
                        return;
                    }

                    // prepare
                    vm.removingLastTag = true;
                };

                vm.initialize();
            }],
            templateUrl : CONFIG.TEMPLATE_PATH + 'editor/_editor-tags.html',
            link : function(scope, element, attributes, ngModel) {
                scope.$watch('tags', function(tags) {
                    scope.et.postTags = tags;
                });

                var input = angular.element(element)
                    .find('input');

                // bind some key events
                input.bind('keyup', function(e) {
                    // check if the user pressed enter key
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        // submit the tag or whatever the content of the input
                        scope.$apply(function() {
                            scope.et.addToPostTags();
                        });
                    }
                })
                .bind('keydown', function(e) {
                    // make sure that we're not going to submit the form
                    if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                        e.preventDefault();
                    }

                    // check if the user pressed the backspace
                    if (e.keyCode === 8) {
                        scope.$apply(function() {
                            // delete the last tag
                            scope.et.removeLastTag();
                        });
                    }

                    if (e.keyCode !== 8) {
                        scope.et.removingLastTag = false;
                    }
                });
            }
        }
    }
})();
