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
    $itemMsg='';
    if (isset($_GET['del'])){
        $msg= '';

        $u_Id= base64_decode($_GET['del']);
        $sql_del= 'DELETE FROM items WHERE id=?';

        $del_res= $Connect->prepare($sql_del);
        $del_res->bindParam(1, $u_Id);

        if ($del_res->execute()) $msg= 'One item deleted';
        else $msg= 'Sorry!, deletion failed';
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
        <a href="post_item.php">Post Item</a>
        <a href="dashboard.php">Dashboard</a>
    </div>
  
    <?php
        $market_owner= $_SESSION['user_name'];
        $query_item= 'SELECT * FROM items WHERE marketId=?';
        $item_res= $Connect->prepare($query_item);
        
        $item_res->bindParam(1, $market_owner);
        $item_res->execute();

        if($item_res->rowCount()== 0){
            $itemMsg='You have not posted any items yet';
        }
    ?>

    <p id= "warning_msg"><?php echo $itemMsg ?></p>
    <div class= "all_items_container">
        <?php
            
        foreach($item_res as $res){?>
                
            <div class="single_item">
                <h3><?php echo $res['itemName'];?></h3>
                <p><?php echo $res['itemDescription'];?></p>
                <p style="color:red;">Price: <?php echo $res['itemPrice'];?> UAH</p><br>

                <div class="operations">
            
                    <div><a href="userItems.php?del=<?php echo base64_encode($res['id']);?>">
                    <img src="assets/images/delete_item.png" alt="Delete"></a></div>

                    <div><a href="update_item.php?edit=<?php echo base64_encode($res['id']);?>">
                    <img src="assets/images/update_item.png" alt="Update"></a></div>
            
                </div>
            </div>           
                <?php
            }?>
    </div>
</body>
</html>