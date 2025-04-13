import { useState } from "react";
import { useFormik } from "formik";

const LoanCalculator = () => {
  const [results, setResults] = useState({
    monthly: 0,
    total: 0,
    interest: 0,
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      interest: '',
      years: '',
    },
    validate: ({ amount, interest, years }) => {
      const errors = {};

      if (!amount) errors.amount = "Loan amount is required.";
      else if (isNaN(amount) || amount <= 0) errors.amount = "Please enter a valid positive loan amount.";

      if (!interest) errors.interest = "Interest rate is required.";
      else if (isNaN(interest) || interest <= 0) errors.interest = "Please enter a valid positive interest rate.";

      if (!years) errors.years = "Loan term is required.";
      else if (isNaN(years) || years <= 0) errors.years = "Please enter a valid loan term in years.";

      return errors;
    },
    onSubmit: ({ amount, interest, years }) => {
      const principal = parseFloat(amount);
      const monthlyInterest = parseFloat(interest) / 100 / 12;
      const payments = parseFloat(years) * 12;

      const x = Math.pow(1 + monthlyInterest, payments);
      const monthly = (principal * x * monthlyInterest) / (x - 1);

      if (isFinite(monthly)) {
        const total = monthly * payments;
        const totalInterest = total - principal;

        setResults({
          monthly,
          total,
          interest: totalInterest,
        });
      }
    },
  });

  return (
    <div className="container">
      <div className="calculator-container">
        <div className="form-container">
          <h1 className="title">Smart Loan Calculator</h1>
          <form onSubmit={formik.handleSubmit} className="form">
            {["amount", "interest", "years"].map((field) => (
              <div key={field} className="input-group">
                <label className="input-label">
                  {field === "amount"
                    ? "Loan Amount ($)"
                    : field === "interest"
                    ? "Interest Rate (%)"
                    : "Loan Term (Years)"}
                </label>
                <input
                  type="number"
                  name={field}
                  onChange={formik.handleChange}
                  value={formik.values[field]}
                  placeholder={field === "amount" ? "e.g. 20000" : field === "interest" ? "e.g. 5" : "e.g. 5"}
                  className="input-field"
                />
                {formik.errors[field] && formik.touched[field] && (
                  <p className="error-message">{formik.errors[field]}</p>
                )}
              </div>
            ))}
            <button type="submit" className="calculate-button">
              Calculate Loan →
            </button>
          </form>
        </div>

        <div className="result-container">
          <h2 className="result-title">📊 Loan Summary</h2>
          <div className="result-list">
            <ResultItem label="Monthly Payment" value={results.monthly} />
            <ResultItem label="Total Payment" value={results.total} />
            <ResultItem label="Total Interest" value={results.interest} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultItem = ({ label, value }) => (
  <div className="result-item">
    <p className="result-label">{label}</p>
    <p className="result-value">${value.toFixed(2)}</p>
  </div>
);

export default LoanCalculator;
