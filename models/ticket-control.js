const path = require('path');
const fs = require('fs');

class Ticket {
    constructor(numero, escritorio){
        this.numero = numero,
        this.escritorio = escritorio
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimosCuatro = [];

        this.init();
    }

    get toJSON(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosCuatro: this.ultimosCuatro
        }
    }

    init() {
        const { ultimo, hoy, tickets, ultimosCuatro } = require('../db/data.json');
        if(hoy === this.hoy){
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimosCuatro = ultimosCuatro
        } else {
            //Es otro dia
            this.guardarDB();
        }
    }

    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify(this.toJSON));
    }

    siguiente() {
        this.ultimo += 1;
        this.tickets.push(new Ticket(this.ultimo, null));
        this.guardarDB();
        return 'Ticket ' + this.ultimo;
    }

    atenderTicket(escritorio){
        //No tenemos tickets
        if( this.tickets.length === 0){
            return null;
        }

        const ticket = this.tickets.shift();
        ticket.escritorio = escritorio;

        this.ultimosCuatro.unshift( ticket );

        if( this.ultimosCuatro.length > 4){
            //el -1 se refiere al ultimo valor del arreglo, y el 1 que elimine 1
            this.ultimosCuatro.splice(-1, 1);
        }

        this.guardarDB();
        return ticket;
    }

}
module.exports = TicketControl;