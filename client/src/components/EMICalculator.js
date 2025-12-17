import React, { useState, useEffect } from 'react';
import './EMICalculator.css';

const EMICalculator = ({ propertyPrice }) => {
  // Validate and calculate default loan amount (80% of property price, max 90%)
  const safePrice = propertyPrice && propertyPrice > 0 ? propertyPrice : 10000000;
  const defaultLoanAmount = Math.floor(safePrice * 0.8);
  const maxLoanAmount = Math.floor(safePrice * 0.9);
  const minLoanAmount = Math.max(100000, Math.floor(safePrice * 0.1));
  
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const time = parseFloat(loanTenure) || 0;

    // Validate inputs
    if (principal <= 0 || rate <= 0 || time <= 0 || isNaN(principal) || isNaN(rate) || isNaN(time)) {
      setIsValid(false);
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
      return;
    }

    setIsValid(true);
    const monthlyRate = rate / 12 / 100;
    const months = time * 12;

    if (monthlyRate > 0 && months > 0) {
      try {
        const emiValue = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmountValue = emiValue * months;
        const totalInterestValue = totalAmountValue - principal;

        setEmi(Math.round(emiValue) || 0);
        setTotalAmount(Math.round(totalAmountValue) || 0);
        setTotalInterest(Math.round(totalInterestValue) || 0);
      } catch (error) {
        console.error('Error calculating EMI:', error);
        setIsValid(false);
        setEmi(0);
        setTotalAmount(0);
        setTotalInterest(0);
      }
    }
  };

  return (
    <div className="emi-calculator">
      <h2>EMI Calculator</h2>
      <p className="calculator-description">Calculate your monthly EMI for this property</p>
      
      <div className="calculator-inputs">
        <div className="input-group">
          <label>Loan Amount: ₹{parseFloat(loanAmount).toLocaleString('en-IN')}</label>
          <input
            type="range"
            min={minLoanAmount}
            max={maxLoanAmount}
            step="50000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
          />
          <div className="input-range-labels">
            <span>₹{minLoanAmount.toLocaleString('en-IN')}</span>
            <span>₹{maxLoanAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="input-group">
          <label>Interest Rate: {interestRate}% per annum</label>
          <input
            type="range"
            min="6"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Loan Tenure: {loanTenure} Years</label>
          <input
            type="range"
            min="1"
            max="30"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
          />
        </div>
      </div>

      <div className="calculator-results">
        <div className="result-card primary">
          <h3>Monthly EMI</h3>
          <p className="result-value">₹{emi.toLocaleString('en-IN')}</p>
        </div>
        <div className="result-card">
          <h3>Total Interest</h3>
          <p className="result-value">₹{totalInterest.toLocaleString('en-IN')}</p>
        </div>
        <div className="result-card">
          <h3>Total Amount</h3>
          <p className="result-value">₹{totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {!isValid && (
        <div className="calculator-error">
          <p>Please enter valid values to calculate EMI</p>
        </div>
      )}

      {isValid && totalAmount > 0 && (
        <div className="payment-breakdown">
          <h3>Payment Breakdown</h3>
          <div className="breakdown-chart">
            {totalAmount > 0 && (
              <>
                <div 
                  className="principal-bar" 
                  style={{ width: `${Math.min(100, Math.max(0, (loanAmount / totalAmount) * 100))}%` }}
                >
                  Principal
                </div>
                <div 
                  className="interest-bar" 
                  style={{ width: `${Math.min(100, Math.max(0, (totalInterest / totalAmount) * 100))}%` }}
                >
                  Interest
                </div>
              </>
            )}
          </div>
          <div className="breakdown-legend">
            <div><span className="legend-principal"></span> Principal: ₹{parseFloat(loanAmount).toLocaleString('en-IN')}</div>
            <div><span className="legend-interest"></span> Interest: ₹{totalInterest.toLocaleString('en-IN')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
