<?php //-->
namespace Journal\Http\Controllers;

use Illuminate\Http\Request;
use Journal\Http\Requests;
use Journal\Repositories\Post\PostRepositoryInterface;
use Journal\Repositories\Setting\SettingRepositoryInterface;
use Journal\Repositories\User\UserRepositoryInterface;
use Journal\Repositories\Tag\TagRepositoryInterface;
use View;

class BlogController extends Controller
{
    protected $postPerPage = 10;
    protected $posts;
    protected $settings;
    protected $tags;
    protected $theme = 'casper';
    protected $users;

    public function __construct(PostRepositoryInterface $posts, SettingRepositoryInterface $settings, TagRepositoryInterface $tags, UserRepositoryInterface $users)
    {
        $this->middleware('installation.not');

        // setup the path of the where the themes are located
        View::addLocation(base_path('themes'));

        // repositories
        $this->posts    = $posts;
        $this->tags     = $tags;
        $this->users    = $users;

        // set the settings
        $this->settings = $settings->get(['title', 'description', 'cover_url', 'logo_url']);
    }

    public function author($slug)
    {
        // check if the slug exists
        if (!$slug || empty($slug)) {
            // redirect to 404 page
            return $this->fourOhFour();
        }

        // get the user
        $user = $this->users->findBySlug($slug);

        // user does not exists
        if (empty($user)) {
            return $this->fourOhFour();
        }

        // attach the settings to the view
        $data = $this->settings;

        // set the body class
        $data['body_class'] = 'author-page '.$user->slug;
        // temporary list of posts
        $data['author'] = $user;
        // get the posts of the author
        $data['posts'] = $this->posts->getPostsByAuthor($user->id, $this->postPerPage);
        // set the head
        $data['journal_head'] = $this->journalHeadMeta('author', $user);

        return view($this->theme.'.author', $data);
    }

    public function index()
    {
        // attach the settings to the view
        $data = $this->settings;

        // set the body class
        $data['body_class'] = 'home-page';
        // temporary list of posts
        $data['posts'] = $this->posts->getBlogPosts($this->postPerPage);
        // set the head
        $data['journal_head'] = $this->journalHeadMeta();

        return view($this->theme.'.index', $data);
    }

    public function post($slug)
    {
        // check if parameter is empty
        if (empty($slug)) {
            return $this->fourOhFour();
        }

        // check if post exists
        $post = $this->posts->findBySlug($slug);

        if (empty($post)) {
            return $this->fourOhFour();
        }

        // attach the settings to the view
        $data = $this->settings;

        // set the body class
        $data['body_class'] = 'home-page';
        // set the post
        $data['post'] = $post;
        // set the head
        $data['journal_head'] = $this->journalHeadMeta('post', $post);

        return view($this->theme.'.post', $data);
    }

    public function tags($slug)
    {
        // check if parameter is empty
        if (empty($slug)) {
            return $this->fourOhFour();
        }

        // get the tag
        $tag = $this->tags->findBySlug($slug);

        // check if the tag exists
        if (empty($tag)) {
            return $this->fourOhFour();
        }

        // attach the settings to the view
        $data = $this->settings;

        // set the body class
        $data['body_class'] = 'tag-page '.$tag->slug;
        // set the tag
        $data['tag'] = $tag;
        // get the posts under this tag
        $data['posts'] = $this->tags->getPosts($tag->id, $this->postPerPage);
        // set the head
        $data['journal_head'] = $this->journalHeadMeta('tag', $tag);

        return view($this->theme.'.tag', $data);
    }

    protected function fourOhFour()
    {
        // check if the theme provided a 404 page
        if (view()->exists($this->theme.'.404')) {
            // load it
            return view($this->theme.'.404');
        }

        // use the default one
        return view('errors.404');
    }

    protected function journalHeadMeta($type = null, $data = null)
    {
        // get the settings of the blog
        $settings = $this->settings;

        // set the default
        $content = [
            'siteUrl'       => url(),
            'title'         => $settings['title'],
            'type'          => 'website',
            'description'   => $settings['description'],
            'url'           => url(),
            'imageUrl'      => (strpos($settings['cover_url'], 'http')) ?
                $settings['cover_url'] : url($settings['cover_url'])];

        if (!is_null($type)) {
            if ($type == 'author') {
                // override the default contents
                $content['title'] = $data->name.' - '.$settings['title'];
                $content['type'] = 'profile';
                $content['description'] = null;
                $content['url'] = url('author/'.$data->slug);
                $content['imageUrl'] = (strpos($data->cover_url, 'http')) ?
                    $data->cover_url : url($data->cover_url);
            }

            if ($type == 'post') {
                // override default contents
                $content['title'] = $data->title;
                $content['type'] = 'article';
                $content['description'] = markdown($data->markdown, true, 20);
                $content['url'] = url('post/'.$data->slug);
                $content['imageUrl'] = null;
            }

            if ($type == 'tag') {
                // override the default contents
                $content['title'] = $data->name.' - '.$settings['title'];
                $content['type'] = 'website';
                $content['description'] = null;
                $content['url'] = url('tag/'.$data->slug);
            }
        }

        $meta = [
            ['rel' => 'canonical', 'href' => $content['url']],
            ['attribute' => 'name', 'value' => 'referrer', 'content' => 'origin'],
            ['attribute' => 'property', 'value' => 'og:site_name', 'content' => $settings['title']],
            ['attribute' => 'property', 'value' => 'og:type', 'content' => $content['type']],
            ['attribute' => 'property', 'value' => 'og:title', 'content' => $content['title']],
            ['attribute' => 'property', 'value' => 'og:description', 'content' => $content['description']],
            ['attribute' => 'property', 'value' => 'og:url', 'content' => $content['url']],
            ['attribute' => 'property', 'value' => 'og:image', 'content' => $content['imageUrl']],
            ['attribute' => 'name', 'value' => 'twitter:card', 'content' => 'summary'],
            ['attribute' => 'name', 'value' => 'twitter:title', 'content' => $content['title']],
            ['attribute' => 'name', 'value' => 'twitter:description', 'content' => $content['description']],
            ['attribute' => 'name', 'value' => 'twitter:url', 'content' => $content['url']],
            ['attribute' => 'name', 'value' => 'twitter:image:src', 'content' => $content['imageUrl']],
            ['attribute' => 'name', 'value' => 'generator', 'content' => 'Journal v1.0.0']];

        return view('vendor.meta', ['meta' => $meta]);
    }
}
