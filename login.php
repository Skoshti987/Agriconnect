<html>
<body style="background:url('bg1.jpg'); background-size:cover; background-repeat:no-repeat;">

<?php
  // Connect to the database
  $conn = mysqli_connect("localhost:3306", "root", "", "login");

  // Check connection
  if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
  } else {
      echo "<h1>Form Submitted Successfully</h1><br><br><br><br><br><br><br>";

      // Get form data
      $username = $_REQUEST['username'];
      $password = $_REQUEST['password'];

      // Insert data into the 'seller' table
      $sql = "INSERT INTO seller (username, password) VALUES ('$username', '$password')";

      if (mysqli_query($conn, $sql)) {
          echo "<script>alert('SUBMITTED SUCCESSFULLY');</script>";
      } else {
          echo "Error: " . $sql . "<br>" . mysqli_error($conn);
      }

      // Close the connection
      mysqli_close($conn);
  }
?>

</body>
</html>