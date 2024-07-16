public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static Product getProduct() {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://fakestoreapi.com/products/1'); // Adjust endpoint as needed
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        
        if (response.getStatusCode() == 200) {
            try {
                // Deserialize JSON response into Product object
                Product product = (Product) JSON.deserialize(response.getBody(), Product.class);
                return product;
            } catch (Exception e) {
                throw new AuraHandledException('Failed to deserialize product');
            }
        } else {
            throw new AuraHandledException('Failed to fetch product');
        }
    }
    
    // Define Product class to match JSON structure
    public class Product {
        public Integer id;
        public String title;
        public Decimal price; // Ensure price is Decimal to handle numbers properly
        public String description;
        public String category;
        public String image;
    }
}