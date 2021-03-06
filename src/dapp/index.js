
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });
    

        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            var f = document.getElementById("flight-selection");
            var flight = f.options[f.selectedIndex].value;
            var d = document.getElementById("day-selection");
            var timestamp = d.options[d.selectedIndex].value;
            contract.fetchFlightStatus(flight, timestamp, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })
    

        // User-submitted transaction
        DOM.elid('submit-purchase').addEventListener('click', () => {
            var f = document.getElementById("flight-selection");
            var flight = f.options[f.selectedIndex].value;
            var d = document.getElementById("day-selection");
            var timestamp = d.options[d.selectedIndex].value;
            var v = DOM.elid('insurance-value').value;
            var value = parseFloat( v );
            contract.buyInsurance(flight, timestamp, value, (error, result) => {
                display('Passenger', 'Buy insurance', [ { label: 'Transaction', error: error, value: result} ]);
            });
        })
    

        // Withdraw refund
        DOM.elid('withdraw-refund').addEventListener('click', () => {
            var f = document.getElementById("flight-selection");
            var flight = f.options[f.selectedIndex].value;
            var d = document.getElementById("day-selection");
            var timestamp = d.options[d.selectedIndex].value;
            var v = DOM.elid('insurance-value').value;
            var value = parseFloat( v );
            contract.pay(flight, timestamp, value, (error, result) => {
                display('Passenger', 'Withdraw refund', [ { label: 'Transaction', error: error, value: result} ]);
            });
        })
    
    });
    

})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}







