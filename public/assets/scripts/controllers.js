!function(){"use strict";function e(e,t,o,r,s){e.post=s,e.cancelPost=function(){t.dismiss("cancel")},e.deletePost=function(){o.deletePost(e.post.id).success(function(o){o.error||(r.toast('You have successfully deleted the post "'+e.post.title+'"',"success"),t.close({error:!1}))}).error(function(e){r.toast("Something went wrong. Please try again later.","error"),t.dismiss("cancel")})}}angular.module("journal.component.deletePostModal").controller("DeletePostModalController",["$scope","$modalInstance","DeletePostModalService","ToastrService","post",e])}(),function(){"use strict";function e(e,t,o,r,s,n){var i=this,a=new Date,l=new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes());i.sidebar=!1,i.post={author_id:r.user().id,status:2,tags:[]},i.editor={activePane:"markdown",activeStatus:[],baseUrl:window.location.origin,codemirror:{mode:"markdown",tabMode:"indent",lineWrapping:!0},counter:0,dateNow:l,status:[{"class":"danger",group:1,status:1,text:"Publish Now"},{"class":"primary",group:1,status:2,text:"Save as Draft"},{"class":"danger",group:2,status:2,text:"Unpublish Post"},{"class":"info",group:2,status:1,text:"Update Post"}],tags:[]},i.initialize=function(){i.editor.activeStatus=i.editor.status[1],o.postId&&s.getPost(o.postId).success(function(e){e.post&&(i.post=e.post,1==e.post.status&&(i.editor.activeStatus=i.editor.status[3]),i.editor.dateNow=i.convertDate(e.post.published_at))}).error(function(e){})},i.convertDate=function(e){if(e){var t=new Date(1e3*e);return new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes())}return l},i.deletePost=function(){var o=e.open({animation:!0,templateUrl:"/assets/templates/delete-post-modal/delete-post-modal.html",controller:"DeletePostModalController",resolve:{post:function(){return i.post}}});o.result.then(function(e){e.error||t.go("post.lists")})},i.savePost=function(){var e=i.post;s.save(e).success(function(e){var o=e.post;return i.post.id?(1==o.status&&(i.editor.activeStatus=i.editor.status[3]),2==o.status&&(i.editor.activeStatus=i.editor.status[1]),n.toast('You have successfully updated "'+o.title+'".',"success"),void(i.post=o)):(n.toast('You have successfully created the post "'+o.title+'".',"success"),void t.go("postEditor",{postId:o.id}))}).error(function(e){})},i.setPostStatus=function(e){i.editor.activeStatus=e,i.post.status=e.status},i.showPane=function(e){i.editor.activePane=e},i.toggleSidebar=function(){i.sidebar=!i.sidebar},i.wordCounter=function(){return i.editor.counter>0?i.editor.counter+" words":"0 words"},i.initialize()}angular.module("journal.component.editor").controller("EditorController",["$modal","$state","$stateParams","AuthService","EditorService","ToastrService",e])}(),function(){"use strict";function e(e,t,o){var r=this;r.user=o.user(),r.logout=function(){o.logout(),t.go("login")},r.setActiveMenu=function(e){var o=t.current.name;return o.indexOf(e)>-1},r.toggleSidebar=function(){e.$broadcast("toggle-sidebar")}}angular.module("journal.component.header").controller("HeaderController",["$rootScope","$state","AuthService",e])}(),function(){"use strict";function e(e){var t=this;e.$on("installer-menu",function(e,o){t.active=o||1})}angular.module("journal.component.installer").controller("InstallerController",["$rootScope",e])}(),function(){"use strict";function e(e,t,o,r,s){e.$broadcast("installer-menu",2);var n=this;n.account=[],n.errors=[],n.createAccount=function(){s.createAccount(n.account).success(function(e){e.token&&(o.login(e.user),o.setToken(e.token),t.go("installer.success"))}).error(function(e){r.toast("There are some errors encountered.","error"),e.errors&&(n.errors=e.errors)})}}angular.module("journal.component.installerDetails").controller("InstallerDetailsController",["$rootScope","$state","AuthService","ToastrService","InstallerDetailsService",e])}(),function(){"use strict";function e(e){e.$broadcast("installer-menu",1)}angular.module("journal.component.installerStart").controller("InstallerStartController",["$rootScope","$state","AuthService","GrowlService",e])}(),function(){"use strict";function e(e,t,o,r){e.$broadcast("installer-menu",3);var s=this;s.initialize=function(){return o.user()||o.getToken()?void 0:(r.toast("Hey, something went wrong. Can you repeat again?","error"),void t.go("installer.start"))},s.go=function(){t.go("post.lists")},s.initialize()}angular.module("journal.component.installerSuccess").controller("InstallerSuccessController",["$rootScope","$state","AuthService","ToastrService",e])}(),function(){"use strict";function e(e,t,o,r){var s=this;s.login=[],s.authenticate=function(){var n=s.login;r.authenticate(n.email,n.password).success(function(r){return r.user&&r.token?(t.login(r.user),t.setToken(r.token),o.toast("Welcome, "+r.user.name,"success"),void e.go("post.lists")):void 0}).error(function(e){var t=e.errors.message;o.toast(t,"error")})}}angular.module("journal.component.login").controller("LoginController",["$state","AuthService","ToastrService","LoginService",e])}(),function(){"use strict";function e(e,t){var o=this;o.posts=[],o.activePost=null,o.activePane="lists",o.deletePost=function(t){var r=e.open({animation:!0,templateUrl:"/assets/templates/delete-post-modal/delete-post-modal.html",controller:"DeletePostModalController",resolve:{post:function(){return t}}});r.result.then(function(e){if(!e.error){var r=o.posts.indexOf(t);o.posts.splice(r,1),o.activePost=o.posts[0],o.activePane="lists"}})},o.initialize=function(){t.getPosts().success(function(e){e.posts&&(o.posts=e.posts,o.activePost=e.posts[0])})},o.goBack=function(){o.activePane="lists"},o.previewThisPost=function(e){o.activePost=e,o.activePane="preview"},o.initialize()}angular.module("journal.component.postLists").controller("PostListsController",["$modal","PostListService",e])}(),function(){"use strict";function e(e,t,o){var r=this;r.settings=[],r.initialize=function(){o.getSettings("title,description,post_per_page,cover_url,logo_url").success(function(e){e.settings&&(r.settings=e.settings)})},r.saveSettings=function(){o.saveSettings(r.settings).success(function(e){e.settings&&t.toast("You have successfully updated the settings.","success")})},r.showImageUploader=function(t){var o=e.open({animation:!0,templateUrl:"/assets/templates/uploader-modal/uploader-modal.html",controller:"SettingsModalController",resolve:{settings:function(){return r.settings},type:function(){return t}}});o.result.then(function(e){r.settings=e})},r.initialize()}angular.module("journal.component.settings").controller("SettingsController",["$modal","ToastrService","SettingsService",e])}(),function(){"use strict";function e(e,t,o,r,s,n,i){e.activeOption="file",e.imageUrl=null,e.image={link:null,file:null},e.settings=n,e.upload={active:!1,percentage:0},e.$watch("image.file",function(){null!=e.image.file&&s.upload(e.image.file).progress(function(t){e.upload={active:!0,percentage:parseInt(100*t.loaded/t.total)}}).success(function(t){t.url&&(e.imageUrl=t.url,e.upload={active:!1,percentage:0})}).error(function(){o.toast("Something went wrong with the upload. Please try again later.","error"),e.upload={active:!1,percentage:0}})}),e.closeModal=function(){t.dismiss("cancel")},e.initialize=function(){"cover_url"==i&&e.settings.cover_url&&(e.imageUrl=e.settings.cover_url),"logo_url"==i&&e.settings.logo_url&&(e.imageUrl=e.settings.logo_url)},e.removeImage=function(){e.imageUrl=null,e.settings[i]=null},e.save=function(){e.settings[i]=e.imageUrl?e.imageUrl:e.image.link,r.saveSettings(e.settings).success(function(e){e.settings&&(o.toast("You have successfully updated the settings.","success"),t.close(e.settings))})},e.switchOption=function(){switch(e.activeOption){case"link":e.activeOption="file";break;case"file":e.activeOption="link";break;default:e.activeOption="file"}},e.initialize()}angular.module("journal.component.settingsModal").controller("SettingsModalController",["$scope","$modalInstance","ToastrService","SettingsService","FileUploaderService","settings","type",e])}(),function(){"use strict";function e(e,t,o){var r=this;r.openSidebar=!1,r.user=o.user(),t.$on("toggle-sidebar",function(){r.openSidebar=!r.openSidebar}),r.logout=function(){o.logout(),e.go("login")},r.tapOverlay=function(){r.openSidebar=!r.openSidebar},r.toggleSidebar=function(){r.openSidebar=!r.openSidebar}}angular.module("journal.component.sidebar").controller("SidebarController",["$state","$rootScope","AuthService",e])}(),function(){"use strict";function e(e,t){var o=this;o.user=[],o.errors=[],o.createUser=function(){o.errors=[],t.createUser(o.user).success(function(t){t.user&&(o.user=[],e.toast("You have successfully added "+t.user.name,"success"))}).error(function(t){if(t.errors){e.toast("There are errors encountered.","error"),o.errors=t.errors;for(var r in t.errors)e.toast(t.errors[r][0],"error")}})}}angular.module("journal.component.userCreate").controller("UserCreateController",["ToastrService","UserCreateService",e])}(),function(){"use strict";function e(e,t){var o=this;o.users=[],o.initialize=function(){e.getAllUsers().success(function(e){e.users&&(o.users=e.users)}).error(function(){})},o.setUserAvatarImage=function(e){return e.avatar_url?e.avatar_url:t.DEFAULT_AVATAR_URL},o.initialize()}angular.module("journal.component.userLists").controller("UserListsController",["UserListsService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,s,n){var i=this;i.current=!1,i.user=[],i.initialize=function(){!t.userId,s.getUser(t.userId).success(function(e){e.user&&(i.current=o.user().id==e.user.id,i.user=e.user)}).error(function(e,t){})},i.setImage=function(e){var t=null;switch(e){case"cover_url":t=i.user.cover_url?i.user.cover_url:n.DEFAULT_COVER_URL;break;case"avatar_url":t=i.user.avatar_url?i.user.avatar_url:n.DEFAULT_AVATAR_URL}return"background-image: url('"+t+"')"},i.showImageUploader=function(t){if(i.current){var o=e.open({animation:!0,templateUrl:"/assets/templates/uploader-modal/uploader-modal.html",controller:"UserProfileModalController",resolve:{user:function(){return i.user},type:function(){return t}}});o.result.then(function(e){i.user=e})}},i.updateProfile=function(){var e=i.user;s.updateUserDetails(e).success(function(e){e.user&&r.toast("You have successfully updated your profile.","success")}).error(function(e){})},i.initialize()}angular.module("journal.component.userProfile").controller("UserProfileController",["$modal","$stateParams","AuthService","ToastrService","UserProfileService","CONFIG",e])}(),function(){"use strict";function e(e,t,o,r,s,n,i){e.activeOption="file",e.imageUrl=null,e.image={link:null,file:null},e.user=n,e.upload={active:!1,percentage:0},e.$watch("image.file",function(){null!=e.image.file&&s.upload(e.image.file).progress(function(t){e.upload={active:!0,percentage:parseInt(100*t.loaded/t.total)}}).success(function(t){t.url&&(e.imageUrl=t.url,e.upload={active:!1,percentage:0})}).error(function(){o.toast("Something went wrong with the upload. Please try again later.","error"),e.upload={active:!1,percentage:0}})}),e.closeModal=function(){t.dismiss("cancel")},e.initialize=function(){"cover_url"==i&&e.user.cover_url&&(e.imageUrl=e.user.cover_url),"avatar_url"==i&&e.user.avatar_url&&(e.imageUrl=e.user.avatar_url)},e.removeImage=function(){e.imageUrl=null,e.settings[i]=null},e.save=function(){e.user[i]=e.imageUrl?e.imageUrl:e.image.link,r.updateUserDetails(e.user).success(function(e){e.user&&(o.toast("You have successfully updated your profile.","success"),t.close(e.user))}).error(function(e){})},e.switchOption=function(){switch(e.activeOption){case"link":e.activeOption="file";break;case"file":e.activeOption="link";break;default:e.activeOption="file"}},e.initialize()}angular.module("journal.component.userProfileModal").controller("UserProfileModalController",["$scope","$modalInstance","ToastrService","UserProfileService","FileUploaderService","user","type",e])}();