<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>{{ $author->name }}</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{ theme_assets('assets/css/screen.css') }}" rel="stylesheet"/>
    <link href="{{ theme_assets('assets/css/font-awesome.css') }}" rel="stylesheet"/>

    {!! $journal_head !!}
</head>
<body class="author-template">
<header class="main-header {{ ($author->cover_url) ? null : 'no-cover' }}" {!! ($author->cover_url) ? 'style="background-image: url('.$author->cover_url.')"' : null !!}>
    <nav class="site-nav clearfix">
        <a href="{{url('/')}}" class="back-button">
            <i class="fa fa-angle-left"></i>
            Home
        </a>
        <a href="{{url('rss')}}" class="rss-button">
            <i class="fa fa-rss"></i>
            Subscribe
        </a>
    </nav>
    <div class="vertical">
        <div class="header-content">
            <figure class="author-avatar">
                <div class="img" style="background-image: url('{{ $author->avatar_url }}')"></div>
            </figure>
            <h1 class="author-name">{{ $author->name }}</h1>
            <div class="author-meta">
                @if($author->location)
                <span class="author-location">
                    <i class="fa fa-map-marker"></i>
                    {{ $author->location }}
                </span>
                @endif
                @if($author->website)
                <span class="author-website">
                    <i class="fa fa-link"></i>
                    <a href="{{ $author->website }}" target="_blank">
                        {{ $author->website }}
                    </a>
                </span>
                @endif
                <span class="author-post-count">
                    <i class="fa fa-bar-chart"></i>
                    {{ $posts->count() }} posts
                </span>
            </div>
        </div>
    </div>
</header>
<main class="content">
    @foreach($posts as $post)
    <article class="post">
        <header class="post-header">
            <h2 class="post-title">
                <a href="{{ $post->permalink }}">{{ $post->title }}</a>
            </h2>
        </header>
        <section class="post-content">{!! markdown($post->markdown, true, 50) !!}</section>
        <footer class="post-meta">
            <a href="{{ $post->author->permalink }}">{{ $post->author->name }}</a>
            @if($post->tags->count() > 0)
                on
            @endif
            {!! get_post_tags($post) !!}
            <date class="post-date">{{ post_date_time($post) }}</date>
        </footer>
    </article>
    @endforeach
    @include('casper.partials.pagination')
</main>
<footer class="site-footer clearfix">
    <section class="blog">
        <a href="{{url('/')}}">{{ $title }}</a> &copy; {{ date('Y') }}
    </section>
    <section class="platform">
        Proudly published with <a href="https://github.com/ricomonster/journal-blogging-platform" target="_blank">Journal</a>
    </section>
</footer>
</body>
</html>
