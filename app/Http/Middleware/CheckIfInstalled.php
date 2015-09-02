<?php

namespace Journal\Http\Middleware;

use DB, Closure;

class CheckIfInstalled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // check if its installed
        $installed = DB::table('settings')->where('setting', 'installed')->first();

        if (empty($installed)) {
            return $next($request);
        }

        // Journal is installed
        if ($request->ajax()) {
            return response()->json([
                'message' => 'Endpoint not found.'], 404);
        }

        return view('404');
    }
}
