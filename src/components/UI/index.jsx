import React from 'react';

/**
 * Ghar Bhada — Reusable UI Component Primitives
 * Green theme design system with premium feel
 */

// ============================================================================
// BUTTONS
// ============================================================================

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const base = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md disabled:bg-slate-300 disabled:shadow-none',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 disabled:bg-slate-50 disabled:text-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm disabled:bg-slate-300',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:text-slate-300',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:bg-primary-100 disabled:border-slate-300 disabled:text-slate-300',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'cursor-not-allowed opacity-70' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
      {children}
    </button>
  );
};

// ============================================================================
// INPUT FIELDS
// ============================================================================

export const Input = React.forwardRef(
  ({ label, error, hint, icon: Icon = null, disabled = false, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
          <input
            ref={ref}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white
              text-slate-900 placeholder:text-slate-400
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
              transition-all duration-200
              disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// SELECT FIELD
// ============================================================================

export const Select = React.forwardRef(
  ({ label, error, options = [], disabled = false, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white
            text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
            transition-all duration-200
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ============================================================================
// TEXTAREA
// ============================================================================

export const TextArea = React.forwardRef(
  ({ label, error, hint, disabled = false, className = '', rows = 4, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white
            text-slate-900 placeholder:text-slate-400
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none
            transition-all duration-200
            disabled:bg-slate-50 disabled:text-slate-500 resize-none
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

// ============================================================================
// RANGE SLIDER
// ============================================================================

export const RangeSlider = ({ label, min, max, value, onChange, step = 1000, disabled = false }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-3">{label}</label>}
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
          disabled={disabled}
          step={step}
          className="w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
          disabled={disabled}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-slate-700">Rs. {value[0]?.toLocaleString()}</span>
          <span className="text-slate-400">—</span>
          <span className="font-medium text-slate-700">Rs. {value[1]?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// BADGE
// ============================================================================

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`rounded-full font-semibold inline-flex items-center ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// CARD
// ============================================================================

export const Card = ({ children, className = '', noPadding = false, clickable = false, onClick }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-slate-100 shadow-sm
        ${noPadding ? '' : 'p-6'}
        ${clickable ? 'hover:shadow-lg hover:border-slate-200 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ============================================================================
// MODAL / DIALOG
// ============================================================================

export const Modal = ({ isOpen, onClose, title, children, footer = null, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="flex items-center justify-center min-h-full p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full animate-scale-in`}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
          {footer && <div className="flex gap-3 p-6 border-t border-slate-100">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ALERT — supports both children and message prop
// ============================================================================

export const Alert = ({ type = 'info', title = '', message, children, onClose = null, className = '' }) => {
  const types = {
    info: 'bg-sky-50 border-sky-300 text-sky-800',
    success: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
    ),
    success: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
    ),
    warning: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
    ),
    error: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
    ),
  };

  const content = children || message;

  return (
    <div className={`border-l-4 p-4 rounded-xl flex justify-between items-start gap-3 ${types[type]} ${className}`} role="alert">
      <div className="flex gap-3 flex-1 items-start">
        {icons[type]}
        <div className="text-sm">
          {title && <p className="font-semibold mb-0.5">{title}</p>}
          <div>{content}</div>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 transition-opacity shrink-0" aria-label="Dismiss">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
      )}
    </div>
  );
};

// ============================================================================
// SPINNER
// ============================================================================

export const Spinner = ({ size = 'md', centered = false, className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const spinner = <div className={`${sizes[size]} border-3 border-slate-200 border-t-primary-600 rounded-full animate-spin ${className}`} />;
  return centered ? <div className="flex items-center justify-center py-8">{spinner}</div> : spinner;
};

// ============================================================================
// SKELETON
// ============================================================================

export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return <div className={`animate-shimmer rounded-xl ${width} ${height} ${className}`} />;
};

// ============================================================================
// EMPTY STATE
// ============================================================================

export const EmptyState = ({ icon = '📭', title, description, action = null }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="text-6xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-8 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

// ============================================================================
// TABS
// ============================================================================

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div className="flex border-b border-slate-200 gap-0.5 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`px-5 py-3 font-medium text-sm transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6" role="tabpanel">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

// ============================================================================
// TOGGLE SWITCH
// ============================================================================

export const Toggle = ({ checked, onChange, disabled = false, label = '', loading = false }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => !disabled && !loading && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary-600' : 'bg-slate-300'
        } ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
        {loading && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /></div>}
      </button>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </div>
  );
};

// ============================================================================
// DIVIDER
// ============================================================================

export const Divider = ({ className = '' }) => {
  return <div className={`border-t border-slate-200 my-2 ${className}`} />;
};

// ============================================================================
// TOOLTIP
// ============================================================================

export const Tooltip = ({ children, text }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
};

// ============================================================================
// AVATAR
// ============================================================================

export const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-20 h-20 text-xl', xl: 'w-32 h-32 text-3xl' };

  const initial = (name || '?').charAt(0).toUpperCase();

  return (
    <div className={`rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center overflow-hidden shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
};
