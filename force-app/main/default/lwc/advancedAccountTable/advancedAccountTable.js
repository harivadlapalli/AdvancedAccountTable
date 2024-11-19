import { LightningElement, track, wire } from 'lwc';
import getAccountRecs from '@salesforce/apex/AccountController.getAccountRecs';
import getTotalRecordsCount from '@salesforce/apex/AccountController.getTotalRecordsCount';

export default class AdvancedAccountTable extends LightningElement {
    @track accounts;
    @track searchKey = ''; // Holds the search keyworda
    @track sortField = 'Name'; // Default sort field
    @track sortDirection = 'asc'; // Default sort direction
    @track totalRecords = 0;
    @track pageSize = 10;
    @track currentPage = 1;
    @track totalPages = 0;

    @track columns = [
        { label: 'Account Name', fieldName: 'Name', sortable: true },
        { label: 'Industry', fieldName: 'Industry', sortable: true },
        { label: 'Type', fieldName: 'Type', sortable: true },
        { label: 'Phone', fieldName: 'Phone', sortable: true },
        { label: 'Rating', fieldName: 'Rating', sortable: true }, 
        { 
            label: 'Created Date', 
            fieldName: 'CreatedDate', 
            type: 'date', 
            typeAttributes: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" },
            sortable: true 
        },
        { 
            label: 'Last Modified Date', 
            fieldName: 'LastModifiedDate', 
            type: 'date', 
            typeAttributes: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" },
            sortable: true 
        }
    ];

    get isPreviousDisabled(){
        return this.currentPage === 1;
    }

    get isNextDisabled(){
        return this.currentPage === this.totalPages;
    }

    connectedCallback(){
        this.refreshTotalRecordsCount();
    }

    /*// Fetch records based on searchKey, sortField, and sortDirection
    @wire(getAccountRecs, { searchKey: '$searchKey', sortField: '$sortField', sortDirection: '$sortDirection' })
    wiredAccounts({ data, error }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error(error);
        }
    }   

    // Capture search input change
    handleSearchChange(event) {
        this.searchKey = event.target.value;
    }

    // Handle sort event when column headers are clicked
    handleSort(event) {
        const { fieldName: sortField, sortDirection } = event.detail;
        this.sortField = sortField;
        this.sortDirection = sortDirection;
    }*/
    
    refreshTotalRecordsCount(){
        getTotalRecordsCount().then((result) => {
            this.totalRecords = result;
            this.totalPages = Math.ceil(this.totalRecords/this.pageSize);
            this.fetchAccounts();
            console.log('Total Record Count: '+this.totalRecords);
        }).catch((error) => {
            console.log('Error fetching total record count: '+error);
        });
    }
    get remainingRecords() {
        const displayedRecords = this.currentPage * this.pageSize;
        return Math.min(this.totalRecords - displayedRecords + this.pageSize, this.pageSize);
    }    
    fetchAccounts() {
        const offset = (this.currentPage - 1) * this.pageSize;
        getAccountRecs({ 
            searchKey: this.searchKey, 
            sortField: this.sortField, 
            sortDirection: this.sortDirection, 
            offset, 
            sizeOfPage: this.pageSize 
        }).then((result) => {
            this.accounts = result;
        }).catch((error) => {
            console.error('Error fetching accounts:', error);
        });
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchAccounts();
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchAccounts();
        }
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value;
        this.currentPage = 1;
        this.refreshTotalRecordsCount();
    }

    handleSort(event) {
        const { fieldName: sortField, sortDirection } = event.detail;
        this.sortField = sortField;
        this.sortDirection = sortDirection;
        this.fetchAccounts();
    }

    /*@wire(getTotalRecordsCount) getTotalRecs({data,error}){
        if(data){
            this.totalRecords = data;
        }
    }*/
}