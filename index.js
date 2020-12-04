const mortgageValue = document.getElementById("mortgageValue");
const mortgageLength = document.getElementById("mortgageLength");
const interestRate = document.getElementById("interestRate");
const startDate = document.getElementById("startDate");
const overpaymentType = document.getElementById("overpaymentType");
const OverpaymentAmount = document.getElementById("OverpaymentAmount");
const overpaymentDate = document.getElementById("overpaymentDate");
if (OverpaymentAmount.value.length == 0) {
  OverpaymentAmount.value === 0;
}

const form = document.getElementById("mortgageForm");
function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);

const init = () => {
  createTable();
  hideForm();
  showSavings();
};

const calculateRepayment = () => {
  const principal = parseInt(mortgageValue.value);
  const monthlyRate = parseFloat(interestRate.value).toFixed(2) / (100 * 12);
  const period = parseInt(mortgageLength.value) * 12;
  const repayment = (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, period)) /
    (Math.pow(1 + monthlyRate, period) - 1)
  ).toFixed(2);
  return parseFloat(repayment);
};

Date.prototype.toShortFormat = function () {
  let monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getYear() - 100;

  return `${monthName}-${year}`;
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const diffInMonths = (end, start) => {
  var timeDiff = Math.abs(end.getTime() - start.getTime());
  let monthTotal = Math.round(timeDiff / (2e3 * 3600 * 365.25));
  let years = Math.floor(monthTotal / 12);
  let months = monthTotal % 12;
  return `${years} ${years != 1 ? "years" : "year"} and ${months} ${
    months != 1 ? "months" : "month"
  }`;
};

const createTable = () => {
  let table = document.getElementById("mortgageTable");
  table.setAttribute("class", "bg-light text-dark");
  table.innerHTML = `<thead>
  <tr>
    <th scope="col">Month</th>
    <th scope="col">Interest</th>
    <th scope="col">Monthly Repayment</th>
    <th scope="col">Overpayment</th>
    <th scope="col">Balance</th>
  </tr>
</thead>
<tbody>
<tr>
<th scope="row">Starting Balance</th>
<td></td>
<td></td>
<td></td>
<td>${numberWithCommas(parseFloat(mortgageValue.value).toFixed(2))}</td>

</tr>
</tbody>`;

  let balance = parseFloat(mortgageValue.value),
    priorBalance,
    interest,
    repayment,
    overpayment,
    month,
    row,
    cell1,
    cell2,
    cell3,
    cell4,
    cell5,
    accInterest;

  startDateValue = new Date(
    startDate.value.slice(0, 4),
    startDate.value.slice(-2) - 1,
    1
  );
  overpaymentDateValue = new Date(
    overpaymentDate.value.slice(0, 4),
    overpaymentDate.value.slice(-2) - 1,
    1
  );

  accInterest = Number(0);

  for (month = 0; month < parseInt(mortgageLength.value) * 12; month++) {
    row = table.insertRow(-1);
    cell1 = row.insertCell(0);
    cell2 = row.insertCell(1);
    cell3 = row.insertCell(2);
    cell4 = row.insertCell(3);
    cell5 = row.insertCell(4);

    priorBalance = balance;

    if (priorBalance > 0) {
      interest = Number(
        (priorBalance * (parseFloat(interestRate.value) / 100 / 12)).toFixed(2)
      );
    } else {
      interest = Number(0);
    }

    accInterest += interest;

    repayment = Math.min(calculateRepayment(), interest + priorBalance);

    if (
      overpaymentDateValue <= startDateValue &&
      overpaymentType.value == "1"
    ) {
      if (
        parseFloat(OverpaymentAmount.value) >
        interest - repayment + priorBalance
      ) {
        overpayment = 0;
      } else {
        overpayment = parseFloat(OverpaymentAmount.value);
      }
    } else if (
      overpaymentDateValue.getTime() === startDateValue.getTime() &&
      overpaymentType.value == "3"
    ) {
      if (
        parseFloat(OverpaymentAmount.value) >
        interest - repayment + priorBalance
      ) {
        overpayment = 0;
      } else {
        overpayment = parseFloat(OverpaymentAmount.value);
      }
    } else if (
      overpaymentDateValue.getMonth() === startDateValue.getMonth() &&
      overpaymentType.value == "2"
    ) {
      if (
        parseFloat(OverpaymentAmount.value) >
        interest - repayment + priorBalance
      ) {
        overpayment = 0;
      } else {
        overpayment = parseFloat(OverpaymentAmount.value);
      }
    } else {
      overpayment = 0;
    }

    balance = interest - repayment - overpayment + priorBalance;

    cell1.innerHTML = startDateValue.toShortFormat();
    cell2.innerHTML = numberWithCommas(interest.toFixed(2));
    cell3.innerHTML = numberWithCommas(repayment.toFixed(2));
    cell4.innerHTML = numberWithCommas(overpayment.toFixed(2));
    cell5.innerHTML = numberWithCommas(balance.toFixed(2));

    if (balance == 0) {
      break;
    } else {
      startDateValue = new Date(
        startDateValue.setMonth(startDateValue.getMonth() + 1)
      );
    }
  }

  return [accInterest, startDateValue];
};

const hideForm = () => {
  const form = document.getElementById("mortgageForm");
  form.style.display = "none";
};

const showSavings = () => {
  let originalInterest,
    accInterest = createTable()[0],
    intSaving,
    repayment,
    endDate = new Date(
      String(
        parseInt(startDate.value.slice(0, 4)) + parseInt(mortgageLength.value)
      ),
      startDate.value.slice(-2) - 1,
      1
    ),
    newDate = createTable()[1];

  repayment = calculateRepayment();

  originalInterest =
    repayment * (parseInt(mortgageLength.value) * 12) -
    parseInt(mortgageValue.value);

  intSaving = originalInterest - accInterest;

  let savings = `
  <div class="jumbotron">
    <h1 class="display-4" style="color: #659dbd">Savings Summary</h1>
        <p class="lead" style="color: #659dbd">Based on your overpayments, your savings are:<br>
        Interest Savings: £${numberWithCommas(intSaving.toFixed(0))} <br>
        Length Savings: ${diffInMonths(endDate, newDate)}</p>
        <button type="button" class="btn btn-lg btn-secondary" onclick="showForm()">Edit Details</button>
     </div>`;
  document.getElementById("savings").innerHTML = savings;
};

const showForm = () => {
  document.getElementById("savings").innerHTML = "";
  document.getElementById("mortgageTable").innerHTML = "";

  const form = document.getElementById("mortgageForm");
  form.style.display = "block";
};
