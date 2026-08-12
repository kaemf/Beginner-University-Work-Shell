<?php

    define('SERVER_NAME',   '127.0.0.1');
    define('DBNAME',        'market_web_app');
    define('USERNAME',      'root');
    // define('PASSWORD',      '@querries');
    define('PORTNO',        '3306');
    define('CHAR_SET',      'utf8mb4');

    try{
        $dsn= 'mysql:host='.SERVER_NAME.';dbname='.DBNAME.';port_no='.PORTNO.';charaterSet='.CHAR_SET.'';
        $Connect= new PDO($dsn, USERNAME);

        $Connect->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }catch(PDOExeption $er){
        echo('Error in Connection'.$er->getMesage());
    }

?>