!function(){"use strict";angular.module("Journal",["journal.config","journal.constants","journal.routes","journal.run","journal.components.editor","journal.components.login","journal.components.postLists","journal.components.settingsGeneral","journal.components.settingsGeneralModal","journal.components.sidebar","journal.components.userCreate","journal.components.userLists","journal.components.userProfile","journal.components.userProfileModal","journal.shared.auth","journal.shared.deletePostModal","journal.shared.fileUploader","journal.shared.journalLoader","journal.shared.markdownReader","journal.shared.storage","journal.shared.toastr","angular-ladda"]),angular.module("journal.config",["LocalStorageModule","toastr"]),angular.module("journal.constants",[]),angular.module("journal.routes",["ui.router","journal.constants"]),angular.module("journal.run",["ngProgressLite"]),angular.module("journal.components.editor",["ngFileUpload","ui.bootstrap","ui.codemirror"]),angular.module("journal.components.login",[]),angular.module("journal.components.postLists",[]),angular.module("journal.components.settings",[]),angular.module("journal.components.settingsGeneral",[]),angular.module("journal.components.settingsGeneralModal",[]),angular.module("journal.components.sidebar",[]),angular.module("journal.components.userCreate",[]),angular.module("journal.components.userLists",["angularMoment"]),angular.module("journal.components.userProfile",[]),angular.module("journal.components.userProfileModal",[]),angular.module("journal.shared.auth",[]),angular.module("journal.shared.deletePostModal",[]),angular.module("journal.shared.fileUploader",["ngFileUpload"]),angular.module("journal.shared.journalLoader",[]),angular.module("journal.shared.markdownReader",[]),angular.module("journal.shared.storage",["LocalStorageModule"]),angular.module("journal.shared.toastr",["ngAnimate","toastr"])}(),function(){"use strict";function e(e){angular.extend(e,{autoDismiss:!1,containerId:"toast-container",maxOpened:5,newestOnTop:!1,positionClass:"toast-bottom-left",preventDuplicates:!1,preventOpenDuplicates:!0,target:"body",timeOut:1e4})}function t(e){e.defaults.useXDomain=!0,delete e.defaults.headers.common["X-Requested-With"]}function o(e){e.setPrefix("journal")}angular.module("journal.config").config(["$httpProvider",t]).config(["toastrConfig",e]).config(["localStorageServiceProvider",o])}(),function(){"use strict";function e(e,t,o){var r=function(e){return o.TEMPLATE_PATH+e};t.otherwise("/").when("/post","/post/lists"),e.state("editor",{url:"/editor",views:{"":{templateUrl:r("editor/editor.html")}},authenticate:!0}).state("editorPost",{url:"/editor/:postId",views:{"":{templateUrl:r("editor/editor.html")}},authenticate:!0}).state("login",{url:"/login",templateUrl:r("login/login.html"),authenticate:!1}).state("post",{"abstract":!0,url:"/post",views:{"":{templateUrl:r("post/post.html")}},authenticate:!0}).state("post.lists",{url:"/lists",views:{post_content:{templateUrl:r("post-lists/post-lists.html")}},authenticate:!0}).state("settings",{url:"/settings",views:{"":{templateUrl:r("settings/settings.html")}},"abstract":!0,authenticate:!0}).state("settings.general",{url:"/general",views:{settings_content:{templateUrl:r("settings-general/settings-general.html")}}}).state("user",{url:"/user",views:{"":{templateUrl:r("user/user.html")}},"abstract":!0,authenticate:!0}).state("user.create",{url:"/create",views:{user_content:{templateUrl:r("user-create/user-create.html")}},authenticate:!0}).state("user.lists",{url:"/lists",views:{user_content:{templateUrl:r("user-lists/user-lists.html")}},authenticate:!0}).state("user.profile",{url:"/profile/:userId",views:{user_content:{templateUrl:r("user-profile/user-profile.html")}}})}angular.module("journal.routes").config(["$stateProvider","$urlRouterProvider","CONFIG",e])}(),function(){"use strict";function e(e,t,o){var r=o;r.token()&&r.validateToken().then(function(n){if(n.user){if(e.bootFinish=!0,o.login(n.user,r.token()),e.nextPage){var s=e.nextPage;return delete e.nextPage,void t.transitionTo(s.name,s.params)}t.transitionTo("login")}},function(){e.bootFinish=!0,r.logout(),t.transitionTo("login")}),r.token()||(e.bootFinish=!0,r.logout(),t.transitionTo("login"))}function t(e,t,o,r,n){e.$on("$stateChangeStart",function(o,s,i,a,u){return e.bootFinish?(n.start(),e.loggedIn=!0,s.authenticate&&!r.user()&&(t.transitionTo("login"),e.loggedIn=!1,o.preventDefault(),n.done()),void("login"==s.name&&(e.loggedIn=!1,r.user()&&(e.loggedIn=!0,t.transitionTo("post.lists"),o.preventDefault())))):(e.nextPage=s,e.nextPage.params=i,n.done(),void o.preventDefault())}),e.$on("$stateChangeSuccess",function(e,t,r,s,i){o(function(){n.done()})})}angular.module("journal.run").run(["$rootScope","$state","AuthService",e]).run(["$rootScope","$state","$timeout","AuthService","ngProgressLite",t])}(),function(){"use strict";angular.module("journal.constants").constant("CONFIG",{API_URL:"http://localhost:8000/api/v1.0",DEFAULT_AVATAR_URL:"http://40.media.tumblr.com/7d65a925636d6e3df94e2ebe30667c29/tumblr_nq1zg0MEn51qg6rkio1_500.jpg",DEFAULT_COVER_URL:"/assets/images/wallpaper.jpg",VERSION:"2.0.0",CDN_URL:"http://localhost:8000",TEMPLATE_PATH:"/assets/templates/"})}(),function(){"use strict";function e(e,t,o,r,n,s,i){var a=this;a.options={codemirror:{mode:"markdown",tabMode:"indent",lineWrapping:!0},counter:0,toggle:!1},a.post={author_id:r.user().id,status:2,tags:[]},a.processing=!1,a.convertTimestamp=function(e){if(e){var t=new Date(1e3*e);return new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes())}var o=new Date,r=new Date(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes());return r},a.initialize=function(){a.post.published_at=a.convertTimestamp(),t.postId&&n.getPost(t.postId).then(function(e){e.post&&(e.post.published_at=a.convertTimestamp(e.post.published_at),a.post=e.post)},function(e){})},a.openMarkdownHelper=function(){o.open({animation:!0,controllerAs:"mdh",controller:["$uibModalInstance",function(e){var t=this;t.closeModal=function(){e.dismiss("cancel")}}],size:"markdown",templateUrl:i.TEMPLATE_PATH+"editor/_markdown-helper.html"})},a.savePost=function(){var t=a.post;a.processing=!0,n.savePost(t).then(function(t){if(t.post){var o=t.post;a.post.id?s.toast('You have successfully updated "'+o.title+'".',"success"):(s.toast('You have successfully created the post "'+o.title+'"',"success"),e.go("editorPost",{postId:o.id},{notify:!1})),o.published_at=a.convertTimestamp(o.published_at),a.post=o}a.processing=!1},function(e){a.processing=!1})},a.toggleSidebar=function(){a.options.toggle=!a.options.toggle},a.initialize()}angular.module("journal.components.editor").controller("EditorController",["$state","$stateParams","$uibModal","AuthService","EditorService","ToastrService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){var n=this;n.login={},n.processing=!1,n.authenticateLogin=function(){var s=n.login;n.processing=!0,o.authenticate(s.email,s.password).then(function(o){return o.user&&o.token?(r.toast("Welcome back, "+o.user.name),t.login(o.user,o.token),void e.go("post.lists")):void(n.processing=!1)},function(e){n.processing=!1;var t=e.errors.message;return t?void r.toast(t,"error"):void 0})}}angular.module("journal.components.login").controller("LoginController",["$state","AuthService","LoginService","ToastrService",e])}(),function(){"use strict";function e(e,t,o){var r=this;r.active=[],r.loading=!0,r.posts={},r.processing=!0,r.query="",r.openDeletePostModal=function(){var t=r.active;if(t){var n=e.open({animation:!0,size:"delete-post",controllerAs:"dpmc",controller:"DeletePostModalController",templateUrl:o.TEMPLATE_PATH+"delete-post-modal/delete-post-modal.html",resolve:{post:function(){return angular.copy(t)}}});n.result.then(function(e){if(!e.error){var o=r.posts.indexOf(t),n=0==o?o+1:o-1;r.active=r.posts[n],r.posts.splice(o,1)}})["finally"](function(){})}},r.initialize=function(){t.getAllPosts().then(function(e){e.posts&&(r.posts=e.posts,r.active=r.posts[0],r.loading=!1)},function(){ToastrService.toast("Something went wrong while fetching posts from the API. Please try again later.","error"),r.loading=!1})},r.selectThisPost=function(e){r.active=e},r.initialize()}angular.module("journal.components.postLists").controller("PostListsController",["$uibModal","PostListsService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,n){var s=this;s.loading=!0,s.processing=!1,s.settings={},s.themes={},s.initialize=function(){var e="title,description,post_per_page,logo_url,cover_url,theme";o.getSettings(e).then(function(e){e.settings&&(s.settings=e.settings,s.settings.post_per_page&&(s.settings.post_per_page=parseInt(s.settings.post_per_page)))},function(e){s.loading=!1}),o.themes().then(function(e){e.themes&&(s.themes=e.themes),s.loading=!1})},s.openUploaderModal=function(e){var o=t.open({animation:!0,controllerAs:"um",controller:"SettingsGeneralModalController",templateUrl:n.TEMPLATE_PATH+"uploader-modal/uploader-modal.html",resolve:{settings:function(){return angular.copy(s.settings)},type:function(){return e}}});o.result.then(function(e){s.settings=e,s.settings.post_per_page&&(s.settings.post_per_page=parseInt(s.settings.post_per_page))})},s.saveSettings=function(){var t=s.settings;s.processing=!0,o.saveSettings(t).then(function(o){o.settings&&(s.settings=t,s.settings.post_per_page&&(s.settings.post_per_page=parseInt(s.settings.post_per_page)),r.toast("You have successfully updated your blog settings.","success"),e.$broadcast("settings-update")),s.processing=!1},function(){s.processing=!1,r.toast("Something went wrong while processing your request. Please try again later.","error")})},s.initialize()}angular.module("journal.components.settingsGeneral").controller("SettingsGeneralController",["$rootScope","$uibModal","SettingsGeneralService","ToastrService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,n,s,i,a){var u=this;u.settings=i,u.image={link:null,file:null,option:"file",url:""},u.processing=!1,u.type=a,u.upload={active:!1,percentage:0},u.closeModal=function(){o.dismiss("cancel")},u.getImageLink=function(){t(function(){u.image.url=u.image.link,u.image.link=null,u.updatePhotoDetails(u.image.url)},1e3)},u.initialize=function(){switch(u.type){case"cover":u.image.url=u.settings.cover_url||"";break;case"logo":u.image.url=u.settings.logo_url||""}},u.removeImage=function(){u.image.url="",u.updatePhotoDetails(u.image.url)},u.save=function(){var e=u.settings;u.processing=!0,s.saveSettings(e).then(function(e){e.settings&&(n.toast("You have successfully updated your "+u.type+" photo."),o.close(e.settings)),u.processing=!1},function(){n.toast("Something went wrong while uploading the photo to the server.","error"),u.processing=!1})},u.switchOption=function(){return"file"==u.image.option?void(u.image.option="link"):"link"==u.image.option?void(u.image.option="file"):void 0},u.updatePhotoDetails=function(e){switch(u.type){case"cover":u.settings.cover_url=e;break;case"logo":u.settings.logo_url=e}},e.$watch(function(){return u.image.file},function(e){e&&(u.processing=!0,r.upload(e).progress(function(e){u.upload={active:!0,percentage:parseInt(100*e.loaded/e.total)}}).success(function(e){e.url&&(u.image.url=e.url,u.updatePhotoDetails(e.url),u.upload={active:!1,percentage:0}),u.processing=!1}).error(function(){n.toast("Something went wrong with the upload. Please try again later.","error"),u.upload={active:!1,percentage:0},u.processing=!1}))}),u.initialize()}angular.module("journal.components.settingsGeneralModal").controller("SettingsGeneralModalController",["$scope","$timeout","$uibModalInstance","FileUploaderService","ToastrService","SettingsGeneralModalService","settings","type",e])}(),function(){"use strict";function e(e,t){var o=this;o.errors={},o.processing=!1,o.roles={},o.user={},o.initialize=function(){t.getRoles().then(function(e){e.roles&&(o.roles=e.roles)},function(e){})},o.createUser=function(){var r=o.user;o.processing=!0,t.createUser(r).then(function(e){e.user&&(o.user={})},function(t){t.errors&&(e.toast("Oops, there some errors encountered.","error"),o.errors=t.errors)})},o.initialize()}angular.module("journal.components.userCreate").controller("UserCreateController",["ToastrService","UserCreateService",e])}(),function(){"use strict";function e(e,t){var o=this;o.processing=!1,o.users=[],o.initialize=function(){e.getUsers().then(function(e){e.users&&(o.users=e.users),o.processing=!1},function(e){})},o.setUserAvatar=function(e){return e.avatar_url?e.avatar_url:t.DEFAULT_AVATAR_URL},o.initialize()}angular.module("journal.components.userLists").controller("UserListsController",["UserListsService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,n,s,i,a){var u=this;u.current=!1,u.errors={},u.loading=!0,u.loggedInUser=n.user(),u.processing=!1,u.user={},u.initialize=function(){o.userId?i.getUser(o.userId).then(function(e){if(e.user){var t=e.user;u.user=t,u.current=u.loggedInUser.id==t.id,u.loading=!1}},function(e){}):t.transitionTo("user.lists")},u.openPhotoUploader=function(e){var t=r.open({animation:!0,controllerAs:"um",controller:"UserProfileModalController",templateUrl:a.TEMPLATE_PATH+"uploader-modal/uploader-modal.html",resolve:{user:function(){return angular.copy(u.user)},type:function(){return e}}});t.result.then(function(e){u.user=e})},u.setPhoto=function(e){var t;if(!u.loading){switch(e){case"avatar":t=u.user.avatar_url?u.user.avatar_url:a.DEFAULT_AVATAR_URL;break;case"cover":t=u.user.cover_url?u.user.cover_url:a.DEFAULT_COVER_URL}return t}},u.updateProfile=function(){var t=u.user;u.processing=!0,i.updateProfileDetails(t).then(function(t){t.user&&(s.toast("You have successfully updated your profile.","success"),u.user=t.user,n.update("user",t.user),e.$broadcast("user-update")),u.processing=!1},function(e){e.errors&&(s.toast("There are some errors encountered.","error"),u.errors=e.errors),u.processing=!1})},u.initialize()}angular.module("journal.components.userProfile").controller("UserProfileController",["$rootScope","$state","$stateParams","$uibModal","AuthService","ToastrService","UserProfileService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,n,s,i,a){var u=this;u.currentUser=i,u.image={link:null,file:null,option:"file",url:""},u.processing=!1,u.type=a,u.upload={active:!1,percentage:0},u.closeModal=function(){o.dismiss("cancel")},u.getImageLink=function(){t(function(){u.image.url=u.image.link,u.image.link=null,u.updateUserPhotoDetails(u.image.url)},1e3)},u.initialize=function(){switch(u.type){case"avatar":u.image.url=u.currentUser.avatar_url||"";break;case"cover":u.image.url=u.currentUser.cover_url||""}},u.removeImage=function(){u.image.url="",u.updateUserPhotoDetails(u.image.url)},u.save=function(){var e=u.currentUser;u.processing=!0,s.updateUserDetails(e).then(function(e){e.user&&(n.toast("You have successfully updated your "+u.type+" photo."),o.close(e.user)),u.processing=!1},function(){n.toast("Something went wrong while uploading the photo to the server.","error"),u.processing=!1})},u.switchOption=function(){return"file"==u.image.option?void(u.image.option="link"):"link"==u.image.option?void(u.image.option="file"):void 0},u.updateUserPhotoDetails=function(e){switch(u.type){case"avatar":u.currentUser.avatar_url=e;break;case"cover":u.currentUser.cover_url=e}},e.$watch(function(){return u.image.file},function(e){e&&(u.processing=!0,r.upload(e).progress(function(e){u.upload={active:!0,percentage:parseInt(100*e.loaded/e.total)}}).success(function(e){e.url&&(u.image.url=e.url,u.updateUserPhotoDetails(e.url),u.upload={active:!1,percentage:0}),u.processing=!1}).error(function(){n.toast("Something went wrong with the upload. Please try again later.","error"),u.upload={active:!1,percentage:0},u.processing=!1}))}),u.initialize()}angular.module("journal.components.userProfileModal").controller("UserProfileModalController",["$scope","$timeout","$uibModalInstance","FileUploaderService","ToastrService","UserProfileModalService","user","type",e])}(),function(){"use strict";function e(e,t,o,r){var n=this;n.post=r,n.processing=!1,n.closeModal=function(){e.dismiss("cancel")},n.deletePost=function(){var r=n.post;n.processing=!0,t.deletePost(r.id).then(function(t){t.error||(o.toast('You have successfully deleted the post "'+r.title+'"',"success"),e.close(t))},function(t){o.toast("Something went wrong while deleting the post. Please try again","error"),e.dismiss("cancel")})}}angular.module("journal.shared.deletePostModal").controller("DeletePostModalController",["$uibModalInstance","DeletePostModalService","ToastrService","post",e])}(),function(){"use strict";function e(){return{restrict:"C",link:function(){angular.element(document.getElementsByClassName("CodeMirror-scroll")[0]).on("scroll",function(e){var t=angular.element(e.target),o=angular.element(document.getElementsByClassName("preview-wrapper")),r=angular.element(document.getElementsByClassName("CodeMirror-sizer")),n=angular.element(document.getElementsByClassName("rendered-markdown")),s=r[0].offsetHeight-t[0].offsetHeight,i=n[0].offsetHeight-o[0].offsetHeight,a=i/s,u=t[0].scrollTop*a;o[0].scrollTop=u})}}}function t(e){return{require:"ngModel",restrict:"EA",replace:!0,scope:{ngModel:"=ngModel",post:"=post",processing:"=processing"},templateUrl:e.TEMPLATE_PATH+"editor/_editor-publish-buttons.html",controllerAs:"epb",controller:["$scope",function(e){var t=this;t.options={status:2,active:[],buttons:[{"class":"btn-danger",group:1,status:1,text:"Publish Now"},{"class":"btn-primary",group:1,status:2,text:"Save as Draft"},{"class":"btn-danger",group:2,status:2,text:"Unpublish Post"},{"class":"btn-info",group:2,status:1,text:"Update Post"}]},t.processing=!1,t.selectPostStatus=function(o){t.options.active=o,t.options.status=t.options.active.status,e.ngModel=t.options.status},t.setButtons=function(e){var o=t.options.buttons[3];2==e&&(o=t.options.buttons[1]),t.options.active=o}}],link:function(e,t,o){e.$watch("post",function(t){e.epb.setButtons(t.status)}),e.$watch("processing",function(t){e.epb.processing=t})}}}function o(){return{require:"ngModel",restrict:"C",scope:{title:"=ngModel",postId:"=postId",slug:"=slug"},controllerAs:"ips",controller:["$scope","EditorService",function(e,t){var o=this;o.checkPostTitle=function(o,r){t.getSlug(o,r).then(function(t){t.slug&&(e.slug=t.slug)},function(e){})}}],link:function(e,t,o,r){t.on("blur",function(){var t=r.$modelValue;t&&0!=t.length&&e.ips.checkPostTitle(t,e.postId)})}}}function r(e){return{restrict:"EA",scope:{toggle:"=toggle",postData:"=post"},replace:!0,templateUrl:e.TEMPLATE_PATH+"editor/_editor-sidebar.html",controllerAs:"es",controller:["$scope","$state","$uibModal","CONFIG",function(e,t,o,r){var n=this;n.toggle=!1,n.post=[],n.siteUrl=window.location.origin,n.closeSidebar=function(){n.toggle=!1,e.toggle=!1},n.openDeletePostModal=function(){if(n.post.id){var e=o.open({animation:!0,size:"delete-post",controllerAs:"dpmc",controller:"DeletePostModalController",templateUrl:r.TEMPLATE_PATH+"delete-post-modal/delete-post-modal.html",resolve:{post:function(){return angular.copy(n.post)}}});e.result.then(function(e){e.error||t.go("post.lists")})}},e.$watchCollection(function(){return n.post},function(t){e.post=t})}],link:function(e,t,o){e.$watch("postData",function(t){e.es.post=t}),e.$watch("toggle",function(t){e.es.toggle=t})}}}function n(e){return{restrict:"EA",require:"ngModel",scope:{featuredImage:"=ngModel"},replace:!0,templateUrl:e.TEMPLATE_PATH+"editor/_featured-image.html",controllerAs:"fi",controller:["$scope","$timeout","FileUploaderService","ToastrService",function(e,t,o,r){var n=this;n.image={link:null,file:null,option:"file",url:""},n.processing=!1,n.upload={active:!1,percentage:0},n.getImageLink=function(){t(function(){n.image.url=n.image.link,e.featuredImage=n.image.url,n.image.link=null},1e3)},n.removeImage=function(){n.image.url=""},n.switchOption=function(){return"file"==n.image.option?void(n.image.option="link"):"link"==n.image.option?void(n.image.option="file"):void 0},e.$watch(function(){return n.image.file},function(t){t&&o.upload(t).progress(function(e){n.upload={active:!0,percentage:parseInt(100*e.loaded/e.total)}}).success(function(t){t.url&&(n.image.url=t.url,e.featuredImage=n.image.url,n.upload={active:!1,percentage:0})}).error(function(){r.toast("Something went wrong with the upload. Please try again later.","error"),n.upload={active:!1,percentage:0}})})}],link:function(e,t,o,r){e.$watch("featuredImage",function(t){e.fi.image.url=t})}}}function s(e){return{restrict:"EA",require:"ngModel",scope:{tags:"=ngModel"},replace:!0,controllerAs:"et",controller:["$scope","EditorService",function(e,t){var o=this;o.removingLastTag=!1,o.query=null,o.tags={all:{},posts:{},filtered:{},showSuggestions:!1,suggestions:{}},o.addTag=function(e){for(var t in o.tags.posts)if(o.tags.posts[t].slug==e.slug)return;var r=o.tags.suggestions.indexOf(e);o.tags.suggestions.splice(r,1),o.tags.posts.push(e),o.tags.showSuggestions=!1,o.query=null},o.addToPostTags=function(t){if(t&&0!==t.length){for(var r in o.tags.posts)if(o.tags.posts[r].name==t)return;for(var n in o.tags.suggestions)o.tags.suggestions[n].name==t&&o.tags.suggestions.splice(n,1);o.tags.posts.push({name:t}),o.query=null,o.tags.showSuggestions=!1,e.tags=o.tags.posts}},o.initialize=function(){t.getTags().then(function(e){e.tags&&(o.tags.all=e.tags,o.setSuggestionTags())})},o.removeLastTag=function(){if(!(o.query&&0!==o.query.length||0===o.tags.posts.length)){if(o.removingLastTag){var t=o.tags.posts.length-1;return o.tags.suggestions.push(o.tags.posts[t]),o.tags.posts.splice(t,1),e.tags=o.tags.posts,void(o.removingLastTag=!1)}o.removingLastTag=!0}},o.setSuggestionTags=function(){if(o.tags.suggestions=o.tags.all,o.tags.posts)for(var e in o.tags.posts)for(var t in o.tags.suggestions)o.tags.posts[e].name==o.tags.suggestions[t].name&&o.tags.suggestions.splice(t,1)},o.showTagSuggestions=function(){return o.query&&0!=o.query.length?void(o.tags.showSuggestions=!0):void(o.tags.showSuggestions=!1)},o.initialize()}],templateUrl:e.TEMPLATE_PATH+"editor/_editor-tags.html",link:function(e,t,o,r){e.$watch("tags",function(t){e.et.tags.posts=t});var n=angular.element(t).find("input");n.bind("keyup",function(t){13===t.keyCode&&e.$apply(function(){var t=e.et.query;e.et.addToPostTags(t)}),e.$apply(function(){e.et.showTagSuggestions()})}).bind("keydown",function(t){switch(t.keyCode){case 9:case 13:case 27:t.preventDefault();break;case 8:e.$apply(function(){e.et.removeLastTag()});break;case 40:break;case 38:break;default:e.et.removingLastTag=!1}})}}}angular.module("journal.components.editor").directive("editorScroll",[e]).directive("editorPublishButtons",["CONFIG",t]).directive("inputPostSlug",[o]).directive("editorSidebar",["CONFIG",r]).directive("featuredImage",["CONFIG",n]).directive("editorTags",["CONFIG",s])}(),function(){"use strict";function e(){return{restrict:"A",scope:{publishIndicator:"=publishIndicator"},link:function(e,t,o){var r=Math.floor(Date.now()/1e3);o.publishIndicator&&e.$watch(function(){return e.publishIndicator},function(e){var o=r>=e?"Published":"To be published";t.text(o)})}}}angular.module("journal.components.postLists").directive("publishIndicator",[e])}(),function(){"use strict";function e(){return{restrict:"E",templateUrl:"/assets/templates/sidebar/_sidebar-directive.html",replace:!0,controllerAs:"sd",controller:["$rootScope","$state","AuthService","SidebarService",function(e,t,o,r){var n=this;n.sidebar={user:o.user(),title:null},n.initialize=function(){r.getBlogSettings().then(function(e){e.settings&&(n.sidebar.title=e.settings.title)},function(e){})},n.logout=function(){o.logout(),t.go("login")},e.$on("settings-update",function(){r.getBlogSettings().then(function(e){e.settings&&(n.sidebar.title=e.settings.title)},function(e){})}),e.$on("user-update",function(){n.sidebar.user=o.user()}),n.initialize()}]}}angular.module("journal.components.sidebar").directive("journalSidebar",[e])}(),function(){"use strict";function e(e){return{restrict:"EA",scope:{},templateUrl:e.TEMPLATE_PATH+"/journal-loader/_journal-loader.html",link:function(e,t,o){}}}angular.module("journal.shared.journalLoader").directive("journalLoader",["CONFIG",e])}(),function(){"use strict";function e(e){return{restrict:"AE",scope:{journalMarkdown:"=",counter:"="},link:function(t,o,r){var n=function(){var e=0,r=o.text().replace(/^\s\s*/,"").replace(/\s\s*$/,"");r.length>0&&(e=r.match(/[^\s]+/g).length),t.counter=e};if(r.journalMarkdown)t.$watch("journalMarkdown",function(t){var s=t?e.makeHtml(t):"";r.hideScriptIframe&&(s=s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'<div class="embedded-javascript">Embedded JavaScript</div>'),s=s.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,'<div class="embedded-iframe">Embedded iFrame</div>')),o.html(s),n()});else{var s=e.makeHtml(o.text());r.hideScriptIframe&&(s=s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'<div class="embedded-javascript">Embedded JavaScript</div>'),s=s.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,'<div class="embedded-iframe">Embedded iFrame</div>')),o.html(s),n()}}}}angular.module("journal.shared.markdownReader").directive("journalMarkdown",["MarkdownReader",e])}(),function(){"use strict";function e(){var e={};return{config:function(t){e=t},$get:function(){return new showdown.Converter(e)}}}angular.module("journal.shared.markdownReader").provider("MarkdownReader",[e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.getPost=function(o){var r=t.defer();return e.get(this.apiUrl+"/posts/get_post?post_id="+o).success(function(e){r.resolve(e)}).error(function(e){r.reject(e)}),r.promise},this.getSlug=function(o,r){var n=t.defer(),s="slug="+(o||"");return r&&(s+="&post_id="+r),e.get(this.apiUrl+"/posts/check_slug?"+s).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise},this.getTags=function(){var o=t.defer();return e.get(this.apiUrl+"/tags/all").success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise},this.savePost=function(r){var n=t.defer(),s=o.token(),i=this.apiUrl+"/posts/save?token="+s,a=r.author_id||"",u=r.title||"",l=r.markdown||"",c=r.featured_image||"",g=r.slug||"",p=r.status||2,d=r.tags||[],f=r.published_at.getTime()/1e3||Math.floor(Date.now()/1e3);return r.id&&(i+="&post_id="+r.id),e.post(i,{author_id:a,title:u,markdown:l,featured_image:c,slug:g,status:p,tags:d,published_at:f}).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.components.editor").service("EditorService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o){this.apiUrl=o.API_URL,this.authenticate=function(o,r){var n=t.defer(),s={email:o,password:r};return e.post(this.apiUrl+"/auth/authenticate",s).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.components.login").service("LoginService",["$http","$q","CONFIG",e])}(),function(){"use strict";function e(e,t,o){this.apiUrl=o.API_URL,this.getAllPosts=function(){var o=t.defer();return e.get(this.apiUrl+"/posts/all").success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.components.postLists").service("PostListsService",["$http","$q","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.getSettings=function(o){var r=t.defer();return e.get(this.apiUrl+"/settings/get?fields="+o).success(function(e){r.resolve(e)}).error(function(e){r.reject(e)}),r.promise},this.saveSettings=function(r){var n=t.defer(),s=o.token(),i={};for(var a in r)i[a]=r[a];return e.post(this.apiUrl+"/settings/save?token="+s,i).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise},this.themes=function(){var o=t.defer();return e.get(this.apiUrl+"/settings/themes").success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.components.settingsGeneral").service("SettingsGeneralService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.saveSettings=function(r){var n=t.defer(),s=o.token(),i={};for(var a in r)i[a]=r[a];return e.post(this.apiUrl+"/settings/save?token="+s,i).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.components.settingsGeneralModal").service("SettingsGeneralModalService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o){this.apiUrl=o.API_URL,this.getBlogSettings=function(){var o=t.defer(),r="title";return e.get(this.apiUrl+"/settings/get?fields="+r).success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.components.sidebar").service("SidebarService",["$http","$q","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.createUser=function(r){var n=t.defer(),s=o.token();return e.post(this.apiUrl+"/users/create?token="+s,{name:r.name||"",email:r.email||"",password:r.password||"",role:r.role||""}).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise},this.getRoles=function(){var o=t.defer();return e.get(this.apiUrl+"/roles/all").success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.components.userCreate").service("UserCreateService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o){this.apiUrl=o.API_URL,this.getUsers=function(){var o=t.defer();return e.get(this.apiUrl+"/users/all").success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.components.userLists").service("UserListsService",["$http","$q","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.getUser=function(o){var r=t.defer();return e.get(this.apiUrl+"/users/get_user?user_id="+o||"").success(function(e){r.resolve(e)}).error(function(e){r.reject(e)}),r.promise},this.updateProfileDetails=function(r){var n=t.defer(),s=o.token(),i=r.id||"";return e.post(this.apiUrl+"/users/update_profile?user_id="+i+"&token="+s,{name:r.name||"",email:r.email||"",biography:r.biography||"",location:r.location||"",website:r.website||"",avatar_url:r.avatar_url||"",cover_url:r.cover_url||""}).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.components.userProfile").service("UserProfileService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.updateUserDetails=function(r){var n=t.defer(),s=o.token(),i=r.id||"";return e.post(this.apiUrl+"/users/update_profile?user_id="+i+"&token="+s,{name:r.name||"",email:r.email||"",biography:r.biography||"",location:r.location||"",website:r.website||"",avatar_url:r.avatar_url||"",cover_url:r.cover_url||""}).success(function(e){n.resolve(e)}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.components.userProfileModal").service("UserProfileModalService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.login=function(e,t){o.set("user",e),o.set("token",t)},this.logout=function(){o.remove("user"),o.remove("token")},this.token=function(){return o.get("token")},this.update=function(e,t){return o.set(e,t)},this.user=function(){return o.get("user")},this.validateInstallation=function(){},this.validateToken=function(){var o=t.defer();return e.get(this.apiUrl+"/auth/check?token="+this.token()).success(function(e){o.resolve(e)}).error(function(e){o.reject(e)}),o.promise}}angular.module("journal.shared.auth").service("AuthService",["$http","$q","StorageService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r){this.apiUrl=r.API_URL,this.deletePost=function(r){var n=t.defer(),s=o.token(),r=r||"";return e["delete"](this.apiUrl+"/posts/delete?post_id="+r+"&token="+s).success(function(e){n.resolve(e);
}).error(function(e){n.reject(e)}),n.promise}}angular.module("journal.shared.deletePostModal").service("DeletePostModalService",["$http","$q","AuthService","CONFIG",e])}(),function(){"use strict";function e(e,t){this.apiUrl=t.API_URL,this.upload=function(t){return e.upload({url:this.apiUrl+"/upload",file:t})}}angular.module("journal.shared.fileUploader").service("FileUploaderService",["Upload","CONFIG",e])}(),function(){"use strict";function e(e){this.set=function(t,o){return e.set(t,o)},this.get=function(t){return e.get(t)},this.remove=function(t){return e.remove(t)}}angular.module("journal.shared.storage").service("StorageService",["localStorageService",e])}(),function(){"use strict";function e(e){this.toast=function(t,o){switch(o){case"success":e.success(t);break;case"info":e.info(t);break;case"error":e.error(t);break;case"warning":e.warning("message");break;default:e.success(t)}}}angular.module("journal.shared.toastr").service("ToastrService",["toastr",e])}();