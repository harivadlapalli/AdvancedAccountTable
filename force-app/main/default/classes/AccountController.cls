public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountRecs(String searchKey, String sortField, String sortDirection, Integer sizeOfPage, Integer offset) {
        String query = 'SELECT Name, Industry, Type, Phone, Rating, CreatedDate, LastModifiedDate FROM Account';
        
        // Check if a search key is provided and filter results based on it
        if (!String.isBlank(searchKey)) {
            query += '  WHERE Name  = :searchKey OR Industry = :searchKey OR Rating = :searchKey ';
        }
        
        // Add sorting if both sort field and direction are provided
        if (!String.isBlank(sortField) && !String.isBlank(sortDirection)) {
            query += ' ORDER BY ' + sortField + ' ' + sortDirection;
        }
        if (offset != null && sizeOfPage != null) {
            query += ' LIMIT :sizeOfPage OFFSET :offset';
        }
        System.debug(query);
        
        return Database.query(query);
    }

    @AuraEnabled
    public static Integer getTotalRecordsCount(){
        /*List<Account> ar = [select id from Account];
        Integer count = ar.size();
        System.debug('Total Count: '+count);*/
        return [SELECT COUNT() from Account];
    }

    /*@AuraEnabled(cacheable = true)
    public static Integer getTotalRecordsCount(String searchKey){
        List<Account> ar = [select id from Account];
        Integer count = ar.size();
        System.debug('Total Count: '+count);
        return [SELECT COUNT() from Account];
    }*/

}