fetch("https://script.google.com/macros/s/AKfycbwIlOQR-CgxPlrANcY7-QC9BgatK-he48W6qWbMQ8kri20R9UX3YXi9j8TkbGTuiV6XYA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        action: "signup",
        email: "test@example.com",
        name: "Test User",
        password: "password123"
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));


1tNY_fm7JI0OzzhwiYZpil5-T7szU5w7BX-EqJ_Ovu3Y
https://script.google.com/macros/s/AKfycbxd2VOeMV8lmVTbFnUHZ4Wj7Yp0eNkFVIS3yT2u3R8b/dev