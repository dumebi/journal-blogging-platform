<?php //-->
namespace Journal\Repositories\Settings;

use Journal\Repositories\Settings\SettingsRepositoryInterface;
use Journal\Settings;
use DB;

/**
 * Class DbSettingsRepository
 * @package Journal\Repositories\Settings
 */
class DbSettingsRepository implements SettingsRepositoryInterface
{
    /**
     * @param $name
     * @param $value
     * @return mixed
     */
    public function save($name, $value)
    {
        // check first it exists
        $exists = DB::table('settings')
            ->where('name', '=', $name)
            ->first();

        // if it already exists, just update the setting
        if (!empty($exists)) {
            // update
            DB::table('settings')
                ->where('name', '=', $name)
                ->update([
                    'value' => $value
                ]);

            // return the settings
            return $this->get($name);
        }

        // create it
        DB::table('settings')
            ->insert([
                'name' => $name,
                'value' => $value
            ]);

        // return the settings
        return $this->get($name);
    }

    /**
     * @param $settings
     * @return mixed
     */
    public function get($settings)
    {
        // check if the parameter is an array
        if (is_array($settings)) {
            // we need to fetch multiple settings
            $results = [];

            // loop
            foreach ($settings as $key => $value) {
                $result = $this->get($value);

                // check if empty
                if (empty($result)) continue;

                // push to the array
                $results[key($result)] = current($result);
            }

            return $results;
        }

        // just a single setting
        $result = DB::table('settings')
            ->where('name', '=', $settings)
            ->first();

        // check if there's a result
        if (empty($result)) {
            // return an empty array
            return [];
        }

        return [$result->name => $result->value];
    }
}
