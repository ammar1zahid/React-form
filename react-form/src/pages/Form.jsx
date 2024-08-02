import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './AddTaxForm.css';

const initialValues = {
  taxName: '',
  taxPercentage: 0,
  appliedTo: 'some',
  applicableItems: [],
};

const validationSchema = Yup.object({
  taxName: Yup.string().required('Required'),
  taxPercentage: Yup.number().required('Required').min(0).max(100),
});

const apiResponse = [
  {"id":14864,"name":"Recurring Item","category":null},
  {"id":14865,"name":"Jasinthe Bracelet","category":"Bracelets"},
  {"id":14867,"name":"Jasinthe Bracelet","category":"Bracelets"},
  {"id":14868,"name":"Recurring Item with questions","category":null},
  {"id":14869,"name":"Zero amount item with questions","category":null},
  {"id":14870,"name":"Inspire Bracelet","category":"Bracelets"},
  {"id":14872,"name":"Normal item with questions","category":null},
  {"id":14873,"name":"normal item","category":null}
];

const AddTaxForm = () => {
  const [items, setItems] = useState(apiResponse);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSubmit = (values) => {
    console.log({
      ...values,
      applicableItems: values.appliedTo === 'all' ? items.map(item => item.id) : values.applicableItems,
    });
  };

  const handleCategoryChange = (category, checked, setFieldValue, values) => {
    const updatedItems = items
      .filter(item => item.category === category)
      .map(item => item.id);

    if (checked) {
      setFieldValue('applicableItems', [...new Set([...values.applicableItems, ...updatedItems])]);
    } else {
      setFieldValue('applicableItems', values.applicableItems.filter(id => !updatedItems.includes(id)));
    }
  };

  const handleUncategorizedChange = (checked, setFieldValue, values) => {
    const uncategorizedItems = items
      .filter(item => !item.category && item.name !== "Recurring Item" && item.name !== "Recurring Item with questions")
      .map(item => item.id);

    if (checked) {
      setFieldValue('applicableItems', [...new Set([...values.applicableItems, ...uncategorizedItems])]);
    } else {
      setFieldValue('applicableItems', values.applicableItems.filter(id => !uncategorizedItems.includes(id)));
    }
  };

  const handleAppliedToChange = (value, setFieldValue) => {
    if (value === 'all') {
      setFieldValue('applicableItems', items.map(item => item.id));
    } else {
      setFieldValue('applicableItems', []);
    }
    setFieldValue('appliedTo', value);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() !== '') {
      const filtered = items.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSearchItemClick = (id, setFieldValue, values) => {
    if (values.applicableItems.includes(id)) {
      setFieldValue('applicableItems', values.applicableItems.filter(itemId => itemId !== id));
    } else {
      setFieldValue('applicableItems', [...values.applicableItems, id]);
    }
  };

  const renderItems = (items, values, setFieldValue) => {
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))];

    return (
      <div className="items-container">
        {categories.map(category => (
          <div key={category} className="category">
            <div className="category-header">
              <Field
                type="checkbox"
                name="category"
                onChange={(e) => handleCategoryChange(category, e.target.checked, setFieldValue, values)}
                checked={items.filter(item => item.category === category).every(item => values.applicableItems.includes(item.id))}
              />
              {category}
            </div>
            <div className="category-items">
              {items.filter(item => item.category === category).map(item => (
                <div key={item.id} className="item">
                  <Field
                    type="checkbox"
                    name="applicableItems"
                    value={item.id.toString()}
                    checked={values.applicableItems.includes(item.id)}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="category">
          <div className="category-header">
            <Field
              type="checkbox"
              name="uncategorized"
              onChange={(e) => handleUncategorizedChange(e.target.checked, setFieldValue, values)}
              checked={items.filter(item => !item.category && item.name !== "Recurring Item" && item.name !== "Recurring Item with questions")
                .every(item => values.applicableItems.includes(item.id))}
            />
            Uncategorized
          </div>
          <div className="category-items">
            {items.filter(item => !item.category && item.name !== "Recurring Item" && item.name !== "Recurring Item with questions")
              .map(item => (
                <div key={item.id} className="item">
                  <Field
                    type="checkbox"
                    name="applicableItems"
                    value={item.id.toString()}
                    checked={values.applicableItems.includes(item.id)}
                  />
                  {item.name}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="form-container">
          <div className="form-group">
            <label htmlFor="taxName">Tax Name</label>
            <Field name="taxName" type="text" className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="taxPercentage">Tax Percentage</label>
            <Field name="taxPercentage" type="number" className="form-input" />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Search items"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-input"
            />
            {searchTerm && filteredItems.length > 0 && (
              <ul className="search-results">
                {filteredItems.map(item => (
                  <li
                    key={item.id}
                    onClick={() => handleSearchItemClick(item.id, setFieldValue, values)}
                    className={`search-item ${values.applicableItems.includes(item.id) ? 'selected' : ''}`}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>
              <Field
                type="radio"
                name="appliedTo"
                value="all"
                checked={values.appliedTo === 'all'}
                onChange={() => handleAppliedToChange('all', setFieldValue)}
              />
              Apply to all items in collection
            </label>
            <label>
              <Field
                type="radio"
                name="appliedTo"
                value="some"
                checked={values.appliedTo === 'some'}
                onChange={() => handleAppliedToChange('some', setFieldValue)}
              />
              Apply to specific items
            </label>
          </div>
          {values.appliedTo === 'some' && renderItems(items, values, setFieldValue)}
          <button type="submit" className="form-button">
            Apply tax to {values.applicableItems.length} item(s)
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddTaxForm;
