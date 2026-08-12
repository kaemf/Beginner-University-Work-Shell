<?php
    session_start();
?>

<?php
    include('controllers/dbCon.php');
?>

<!DOCTYPE html>

<?php
    include('header.php');
?>

<body>

    <header class="head">
        <h1>WELCOME TO BUY&SOLD MARKET PLACE</h1>
        <h3>The best place to sold or buy...</h3><br>
    </header>

    <div class= "nav">
        <a href="login.php">LogIn</a>
        <a href="signup.php">SignUp</a>
        <a href="index.php">Home</a>
    </div>

    <?php
        $itemMsg='';
        $query_items= $Connect->query('SELECT * FROM items ORDER BY id DESC');

        if ($query_items->rowCount() == 0) $itemMsg="No Items Yet";
    ?>

    <div class="main">
        <h2 style="font-size:30px; border:none;">Our Trending Products</h2>
        <p id="warning_msg"><?php echo $itemMsg ?></p>

        <div class="all_items_container">
                <?php
                    foreach($query_items as $item){
                        echo('
                        <div class= "single_item">
                            <h3>'.$item['itemName'].'</h3>
                            <p>'.$item['itemDescription'].'</p><br>
                            <p style="color:red;">Price: '.$item['itemPrice'].' UAH</p>
                            
                            <div class= "btn">
                            <button style="padding:3px; font-size:16px; color:#ff4d4d; width:65px; 
                            border-radius:5px; background:#fff;" type= "" name=""><small>Shop</small></button>
                        </div>
                        </div>
                        ');
                    }
                ?>
        </div>
    </div>

</body>
</html>