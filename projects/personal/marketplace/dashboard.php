<?php
    session_start();
?>

<?php
    include('helpers/check_login.php');
?>

<?php
    include('controllers/dbCon.php');
?>

<!DOCTYPE html>

<html>

    <?php
        include('header.php');
    ?>

<body>

    <header class="head">
        <h1>WELCOME TO BUY&SOLD MARKET PLACE</h1>
        <h3>The best place to sold or buy...</h3><br>
        <?php echo ('<h2>'.strtoupper($_SESSION['user_name']).'\'s Page Store</h2>');?>
    </header>

    <div class="nav">
        <a href="helpers/logout.php">Logout</a>
        <a href="reset_password.php">Reset password</a>
        <a href="userItems.php">My Items</a>
        <a href="post_item.php">Post Item</a>
    </div>

    <?php
        $msg='';
        $query_items= $Connect->query('SELECT * FROM items ORDER BY id DESC');

        if($query_items->rowCount() == 0) $msg="No Items Yet";
    ?>

    <div class="main">
        <br>
        <h2>All Recently Posted Items</h2></br>
        <p id="warning_msg"><?php echo $msg ?></p>

        <div class="all_items_container">
            <?php
                foreach($query_items as $item){
                    echo('
                    <div class= "single_item">
                        <h3>'.$item['itemName'].'</h3>
                        <p>'.$item['itemDescription'].'</p>
                        <p style="color:red;">Price: '.$item['itemPrice'].' UAH</p>
                    </div>
                    ');
                }
            ?>
        </div>
    </div>

</body>
</html>