<?php
    session_start();
?>

<?php
    include('helpers/check_login.php');
?>

<?php
    include('helpers/item.php');
?>

<!DOCTYPE html>
<html lang="en">

<?php
    include('header.php');
?>

<body>
    <div class="nav">
        <a href="helpers/logout.php">logout</a>
        <a href="userItems.php">My Items</a>
        <a href="dashboard.php">Dashboard</a>
    </div>    

    <div class="formWrap">
        <p id="warning_msg"><?php echo $msg ?></p>
        <p id="success_msg"><?php echo $msg1 ?></p>

        <h1>Post An Item</h1>
        <form action="post_item.php" method="post">
        
            <div id="formInput">
                <input type="text" name= "name_item" placeholder="Item Name">
            </div>

            <div id="formInput">
                <input type="text" name="item_price" placeholder="Item Price;  e.g 1,000">
            </div>
                
            <div id="formInput">
                <textarea rows="3" cols="30" type="text" name="item_desc" placeholder="Item Description"></textarea>
            </div>

            <div class="btn">
                <button type="submit" name="postBtn">POST</button>
            </div>
            
        </form>
    </div>

</body>
</html>