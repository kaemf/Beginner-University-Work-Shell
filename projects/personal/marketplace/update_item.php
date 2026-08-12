<?php
    session_start();
?>

<?php
    include('controllers/dbCon.php');
?>

<?php
    include('helpers/check_login.php');
?>

<?php
    $msg= '';
    if (isset($_GET['edit'])){
        $user_id= base64_decode($_GET['edit']);
    
        $query_item= 'SELECT * FROM items WHERE id=?';
        $item_res=$Connect->prepare($query_item);
        $item_res->bindParam(1, $user_id);
        $item_res->execute();

        $res2=$item_res->fetch();
    }
?>

<?php
    if (isset($_POST['upd'])){
        if (empty($_POST['item_name']) || empty($_POST['item_price']) || empty($_POST['item_desc'])) $msg="Please fill all fields";
        else{
            $Item_name= trim($_POST['item_name']);
            $Item_price= trim($_POST['item_price']);
            $Item_desc= trim($_POST['item_desc']);

            $upd_sql= 'UPDATE items SET itemName=?, itemPrice=?, itemDescription=? WHERE id=?';
            $upd_res=$Connect->prepare($upd_sql);

            $upd_res->bindParam(1, $Item_name);
            $upd_res->bindParam(2, $Item_price);
            $upd_res->bindParam(3, $Item_desc);
            $upd_res->bindParam(4, $user_id);

            if ($upd_res->execute()) header('Location:userItems.php');
            else $msg="Update Failed";
        }
    }
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

        <h1>Update This Item</h1>
        <p id="warning_msg"><?php echo $msg ?></p>
        <form action="" method="post">
        
            <div id="formInput">
                <input type="text" name="item_name" value="<?php print_r($res2['itemName']);?>">
            </div>

            <div id="formInput">
                <input type="text" name="item_price" value="<?php print_r($res2['itemPrice']);?>">
            </div>

            <div id="formInput">
                <input type="text" name="item_desc" value="<?php print_r($res2['itemDescription']);?>">
            </div>

            <div class="btn">
                <button type="submit" name="upd">Update</button>
            </div>
            
        </form>

    </div>

</body>
</html>