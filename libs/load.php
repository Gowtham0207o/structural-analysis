<?


session_start();

function get_configure($key, $default = null)
{
    global $_siteconfig;
    $array = json_decode($_siteconfig, true);
    if (isset($array[$key])) {
        return $array[$key];
    } else {
        return $default;
    }
}

function load_template($value)
{
    include $_SERVER['DOCUMENT_ROOT'] . "/_templates/$value.php";
}
?>