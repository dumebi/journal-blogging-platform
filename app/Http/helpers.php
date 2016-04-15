<?php //-->
/**
 * All of the helpers that Journal needs are registered here. User can also
 * add their own by putting their helper below the file or create a new
 * file and register it app/Providers/JournalServiceProvider.php
 */
use \Michelf\MarkdownExtra;

/**
 * Wraps the Auth::user() to a method.
 *
 * @return Auth;
 */
if (!function_exists('auth_user')) {
    function auth_user()
    {
        return Auth::user();
    }
}

/**
 * Title of the blog, duh.
 *
 * @return string
 */
if (!function_exists('blog_title')) {
    function blog_title()
    {
        $settings = \DB::table('settings')
            ->where('name', 'blog_title')
            ->first();

        return (count($settings) > 0) ?
            $settings->value : null;
    }
}

/**
 * Description of the blog, duh.
 *
 * @return string
 */
if (!function_exists('blog_description')) {
    function blog_description()
    {
        $settings = \DB::table('settings')
            ->where('name', 'blog_description')
            ->first();

        return (count($settings) > 0) ?
            $settings->value : null;
    }
}

/**
 * Checks if the current url is the same or similar to the given keyword and
 * returns a boolean to confirm it.
 */
if (!function_exists('is_active_menu')) {
    function is_active_menu($keyword)
    {
        // get the current url of the page
        $url = Request::url();

        return strpos($url, $keyword);
    }
}

/**
 * Helper function to easily set the path of the file or asset to be used.
 */
if (!function_exists('theme_asset')) {
    function theme_asset($filePath)
    {
        // get the active theme
        $settings = \DB::table('settings')
            ->where('name', 'theme_template')
            ->first();

        return asset('themes/'.$settings->value . '/' . $filePath);
    }
}

/**
 * Converts the markdown content to HTML
 */
if (!function_exists('markdown')) {
    function markdown($markdown)
    {
        $parser = new MarkdownExtra;
        $parser->no_markup = false;

        return $parser->transform($markdown);
    }
}

/**
 * Strips the content of the post to make an excerpt.
 */
if (!function_exists('excerpt')) {
    function excerpt($post, $limit = 50) {
        // check if there's an object content in the post parameter
        if (!$post->content) {
            // return empty
            return null;
        }

        // convert to markdown
        $markdowned = markdown($post->content);

        // remove the tags
        $excerpt = strip_tags($markdowned);

        if (str_word_count($excerpt) > $limit) {
            $limit = $limit + 1;
            $words = explode(' ', $excerpt, $limit);
            array_pop($words);
            $excerpt = implode(' ', $words) . '...';
        }

        return $excerpt;
    }
}

if (!function_exists('post_tags')) {
    function post_tags($tags, $delimiter = ',', $convertToLink = true)
    {
        // check if it is empty
        if (empty($tags)) {
            return false;
        }

        // initialize this
        $tagString = '';

        // loop the tags
        foreach ($tags as $key => $tag) {
            // check if this is the last tag to be looped
            $delimiter = (count($tags) == $key + 1) ? '' : $delimiter;

            // check first if we need it to convert to a link or not
            $tagString .= ($convertToLink) ?
                    // format it!
                    sprintf(
                        '<a href="%s">%s</a>%s&nbsp',
                        url('tag/' . $tag->slug),
                        $tag->title,
                        $delimiter) :
                    // just bring plain old text
                    $tag->title . $delimiter;
        }

        return $tagString;
    }
}
