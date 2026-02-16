import React, { useState } from 'react';
import { Users, MapPin, Trash2, X, Check } from 'lucide-react';
import RouteCard from '../components/RouteCard';

const Creditors = ({ salesHistory, routes, onUpdatePayment, onDeleteRoute, onRenameShop, onRenameRoute }) => { // Added onRenameRoute
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState('');

  const creditSales = salesHistory.filter(s => s.isCredit);
  const totalSystemCredit = creditSales.reduce((sum, s) => sum + (s.totalBill - (s.paidAmount || 0)), 0);

  const openInstallmentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setInstallmentAmount('');
    setShowModal(true);
  };

  const handleConfirmInstallment = () => {
    const amount = parseFloat(installmentAmount);
    if (!isNaN(amount) && amount > 0 && selectedInvoice) {
      onUpdatePayment(selectedInvoice.id, amount, selectedInvoice.shopName);
      setShowModal(false);
      setSelectedInvoice(null);
      setInstallmentAmount('');
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <div className="inventory-container">
      <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: '600', textAlign: 'center' }}>Creditors</h1>
      {/* 1. Header Card */}
      <div className="card sales-card red" style={{ marginBottom: '20px' }}>
        <div className="card-title"><Users size={16} /> Total System Credit</div>
        <div className="card-value">Rs. {totalSystemCredit.toLocaleString()}</div>
      </div>

      {/* 2. Route Sections */}
      {routes.map(route => {
        const routeInvoices = creditSales.filter(s => s.routeName === route);
        if (routeInvoices.length === 0) return null;

        return (
          <RouteCard
            key={route}
            route={route}
            routeInvoices={routeInvoices}
            onDeleteRoute={onDeleteRoute}
            openInstallmentModal={openInstallmentModal}
            onRenameShop={onRenameShop}
            onRenameRoute={onRenameRoute}
          />
        );
      })}

      {/* 3. CUSTOM MODAL (Fixed for Electron) */}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', padding: '20px', background: 'var(--sidebar-bg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Add Payment</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>
              Shop: <strong>{selectedInvoice?.shopName}</strong><br />
              Remaining: <strong>Rs. {(selectedInvoice?.totalBill - (selectedInvoice?.paidAmount || 0)).toLocaleString()}</strong>
            </p>

            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: 'var(--text-light)', width: '100%' }}>Payment Amount (Rs.)</label>
              <input
                autoFocus
                type="number"
                className="inventory-input"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmInstallment()}
                placeholder="Enter amount..."
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="delete-btn" onClick={() => setShowModal(false)} style={{ background: '#444' }}>Cancel</button>
              <button className="add-btn" onClick={handleConfirmInstallment} style={{ background: '#107c10' }}>
                <Check size={16} style={{ marginRight: '5px' }} /> Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Creditors;