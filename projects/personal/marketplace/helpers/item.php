<?php
    include('controllers/dbCon.php');
?>

<?php
    $msg='';
    $msg1='';
    if(isset($_POST['postBtn'])){
        if(empty($_POST['name_item']) || empty($_POST['item_desc']) || empty($_POST['item_price'])){
                $msg= "Please fill all item details";
        }else{
            $mkt_identifier= $_SESSION['user_name'];
            $_item_name = trim($_POST['name_item']);
            $_item_description = trim($_POST['item_desc']);
            $_item_price = trim($_POST['item_price']);
                
            $sqlItem= 'INSERT INTO items (marketId,itemName,itemDescription,itemPrice) VALUES (?,?,?,?)';
            $queryItem= $Connect->prepare($sqlItem);

            $queryItem->bindParam(1, $mkt_identifier);
            $queryItem->bindParam(2, $_item_name);
            $queryItem->bindParam(3, $_item_description);
            $queryItem->bindParam(4, $_item_price);
            
            if($queryItem->execute()) $msg1= "Item Added Successfully!";
            else $msg= "Item add failure...";
        }
    }

?>