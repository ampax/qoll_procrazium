<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Default - One Page Responsive Templates</title>
    <link href="images/favicon.ico" rel="icon" type="image/x-icon" />
    <!-- Stylesheet -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/main.css">
    <!-- font -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300,400' rel='stylesheet' type='text/css'>
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
      <div class="container">
        <div class="row" style="text-align:center;margin-top:20px;">      
          <?php
            $EmailTo = "kaushik.amit@gmail.com";
            $Subject = "Site Contact";
            $Name = Trim(stripslashes($_POST['Name'])); 
            $Email = Trim(stripslashes($_POST['Email'])); 
            $Message = Trim(stripslashes($_POST['Message'])); 

            // Email body text
            $Body = "";
            $Body .= "Name: ";
            $Body .= $Name;
            $Body .= "\n";
            $Body .= "Email: ";
            $Body .= $Email;
            $Body .= "\n";
            $Body .= "Message: ";
            $Body .= $Message;
            $Body .= "\n";

            // send email 
            $success = mail($EmailTo, $Subject, $Body, "From: <$Email>");
            if ($_POST['submit']) {
                if ($Name != '' && $Email != '' && $Message != '') {               
                    if ($success) { 
                      echo '<p class="bg-success" style="padding:15px 10px;">Your message has been sent!</p>'; 
                  } else { 
                      echo '<p class="bg-danger" style="padding:15px 10px;">Something went wrong, go back and try again!</p>'; 
                  }
                } else {
                    echo '<p class="bg-danger" style="padding:15px 10px;">You need to fill in all required fields!!</p>';
                }
            }
            ?>
        </div>
      </div>
  </body>
</html>