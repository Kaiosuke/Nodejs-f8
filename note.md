<!-- Login -->

login: http://localhost:8080/api/auth/login
register: http://localhost:8080/api/auth/register

<!-- Other -->

getAll: http://localhost:8080/api/products -- Only filter products with deleted: false
createOne: http://localhost:8080/api/products
CreateMany: http://localhost:8080/api/products/many
Update: http://localhost:8080/api/products/:id
Delete: http://localhost:8080/api/products/product/:id
Force Delete: http://localhost:8080/api/products/product/:id/force
Force DeleteMany: http://localhost:8080/api/products/many

<!-- Token -->

token: Bearer accessToken
