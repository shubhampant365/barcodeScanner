import { LightningElement, track, api } from 'lwc';
import createOrderAndItems from '@salesforce/apex/OrderController.createOrderAndItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CounterSaleOrder extends LightningElement {
    @api recordId; // WorkOrder Id
    @track firstName = '';
    @track lastName = '';
    @track productId = '';
    @track quantity = '';
    @track unitPrice = '';
    @track totalPrice = '';
    @track discount = '';
    @track finalSalePrice = '';
    @track billToLocation = '';
    @track shipToLocation = '';
    @track invoiceNumber = '';
    @track invoiceDate = '';

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleProductChange(event) {
        this.productId = event.target.value;
    }

    handleQuantityChange(event) {
        this.quantity = event.target.value;
        this.calculatePrices();
    }

    handleUnitPriceChange(event) {
        this.unitPrice = event.target.value;
        this.calculatePrices();
    }

    handleDiscountChange(event) {
        const discountValue = event.target.value;
        if (discountValue > 100) {
            this.showToast('Error', 'Discount cannot be more than 100%', 'error');
            this.discount = 100;
        } else {
            this.discount = discountValue;
        }
        this.calculatePrices();
    }

    handleBillToLocationChange(event) {
        this.billToLocation = event.target.value;
    }

    handleShipToLocationChange(event) {
        this.shipToLocation = event.target.value;
    }

    handleInvoiceNumberChange(event) {
        this.invoiceNumber = event.target.value;
    }

    handleInvoiceDateChange(event) {
        this.invoiceDate = event.target.value;
    }

    calculatePrices() {
        if (this.quantity && this.unitPrice) {
            this.totalPrice = this.quantity * this.unitPrice;
            // Correct discount calculation as a percentage
            const discountAmount = (this.totalPrice * this.discount) / 100;
            this.finalSalePrice = this.totalPrice - discountAmount;
        } else {
            this.totalPrice = '';
            this.finalSalePrice = '';
        }
    }

    handleSave() {
        createOrderAndItems({
            workOrderId: this.recordId,
            firstName: this.firstName,
            lastName: this.lastName,
            productId: this.productId,
            quantity: this.quantity,
            unitPrice: this.unitPrice,
            totalPrice: this.totalPrice,
            discount: this.discount,
            finalSalePrice: this.finalSalePrice,
            billToLocation: this.billToLocation,
            shipToLocation: this.shipToLocation,
            invoiceNumber: this.invoiceNumber,
            invoiceDate: this.invoiceDate
        })
        .then(() => {
            this.showToast('Success', 'Order and Order Items created successfully!', 'success');
            this.resetForm();
        })
        .catch(error => {
            this.showToast('Error', 'Error creating order: ' + error.body.message, 'error');
        });
    }

    resetForm() {
        this.firstName = '';
        this.lastName = '';
        this.productId = '';
        this.quantity = '';
        this.unitPrice = '';
        this.totalPrice = '';
        this.discount = '';
        this.finalSalePrice = '';
        this.billToLocation = '';
        this.shipToLocation = '';
        this.invoiceNumber = '';
        this.invoiceDate = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}
