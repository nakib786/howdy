# Howdy Cafe Promo System

A comprehensive promotional system for Howdy Cafe that allows admins to create and manage promotional offers with discounted prices, featuring both percentage and fixed amount discounts.

## Features

### 🎯 **Flexible Discount Types**
- **Percentage Discounts**: Reduce prices by a percentage (e.g., 20% off)
- **Fixed Amount Discounts**: Reduce prices by a fixed dollar amount (e.g., $5 off)

### 📅 **Time-Based Promotions**
- Set start and end dates for each promotion
- Automatic activation/deactivation based on dates
- Real-time status tracking

### 🎯 **Targeted Promotions**
- **All Items**: Apply to entire menu
- **Specific Categories**: Target specific menu categories
- **Specific Items**: Target individual menu items

### 🔐 **Usage Controls**
- Optional promo codes for customer redemption
- Maximum usage limits per promotion
- Usage tracking and analytics

### 🎨 **Beautiful UI**
- Eye-catching promo section on the main website
- Strikethrough original prices with discounted prices
- Visual savings indicators
- Responsive design for all devices

## Database Setup

### 1. Run the SQL Script
Execute the `promo_setup.sql` script in your Supabase SQL editor to create the necessary tables and functions.

### 2. Database Schema

#### `promos` Table
```sql
- id: UUID (Primary Key)
- name: VARCHAR(255) - Promotion name
- description: TEXT - Promotion description
- discount_type: VARCHAR(20) - 'percentage' or 'fixed_amount'
- discount_value: DECIMAL(10,2) - Discount amount
- start_date: TIMESTAMP - When promotion starts
- end_date: TIMESTAMP - When promotion ends
- is_active: BOOLEAN - Whether promotion is active
- applies_to: VARCHAR(20) - 'all_items', 'specific_categories', or 'specific_items'
- category_ids: TEXT[] - Array of category IDs (if applies_to = 'specific_categories')
- item_ids: TEXT[] - Array of item IDs (if applies_to = 'specific_items')
- promo_code: VARCHAR(50) - Optional promo code
- max_uses: INTEGER - Maximum number of uses
- current_uses: INTEGER - Current number of uses
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `promo_items` Table
```sql
- id: UUID (Primary Key)
- promo_id: UUID (Foreign Key to promos)
- menu_item_id: UUID (Foreign Key to menu_items)
- original_price: DECIMAL(10,2)
- discounted_price: DECIMAL(10,2)
- created_at: TIMESTAMP
```

## Frontend Components

### 1. PromoSection Component (`src/components/PromoSection.tsx`)
- Displays active promotions on the main website
- Shows discounted prices with strikethrough original prices
- Calculates and displays savings
- Responsive design with animations

### 2. Admin Dashboard Integration
- New "Promotions" tab in the admin dashboard
- Add, edit, and delete promotions
- Visual promo cards with status indicators
- Comprehensive form for promo creation

## Usage Guide

### For Admins

#### Creating a New Promotion
1. Go to Admin Dashboard → Promotions tab
2. Click "Add Promotion"
3. Fill in the promotion details:
   - **Name**: Descriptive name for the promotion
   - **Description**: Detailed description
   - **Discount Type**: Choose percentage or fixed amount
   - **Discount Value**: Enter the discount amount
   - **Start/End Dates**: Set promotion period
   - **Applies To**: Choose target scope
   - **Promo Code** (Optional): Create a code for customers
   - **Max Uses** (Optional): Limit promotion usage

#### Managing Promotions
- **Edit**: Click the edit icon on any promo card
- **Delete**: Click the delete icon (with confirmation)
- **Status**: Toggle active/inactive status
- **Usage Tracking**: Monitor current usage vs max uses

### For Customers

#### Viewing Promotions
- Promotions appear in a dedicated "Special Offers" section
- Original prices are shown with strikethrough
- Discounted prices are prominently displayed
- Savings amount is clearly indicated

#### Using Promo Codes
- Some promotions may require promo codes
- Codes are displayed on the promotion cards
- Customers can use codes during checkout (if implemented)

## Example Promotions

### 1. Summer Special
- **Type**: Percentage discount
- **Value**: 20% off
- **Scope**: All menu items
- **Duration**: 30 days
- **Code**: SUMMER2024
- **Max Uses**: 100

### 2. Biryani Bonanza
- **Type**: Fixed amount discount
- **Value**: $5 off
- **Scope**: Specific categories (Biryani)
- **Duration**: 14 days
- **Code**: BIRYANI5
- **Max Uses**: 50

### 3. New Customer Discount
- **Type**: Percentage discount
- **Value**: 15% off
- **Scope**: All menu items
- **Duration**: 90 days
- **Code**: WELCOME15
- **Max Uses**: 200

## Technical Implementation

### Price Calculation
```typescript
const calculateDiscountedPrice = (originalPrice: number, promo: Promo): number => {
  if (promo.discount_type === 'percentage') {
    return Math.max(0, originalPrice - (originalPrice * promo.discount_value / 100));
  } else {
    return Math.max(0, originalPrice - promo.discount_value);
  }
};
```

### Active Promo Query
```sql
SELECT * FROM promos 
WHERE is_active = true 
  AND NOW() BETWEEN start_date AND end_date
  AND (max_uses IS NULL OR current_uses < max_uses)
ORDER BY created_at DESC;
```

### Frontend Integration
The promo system integrates seamlessly with the existing menu system:
- Promotions are displayed between the Menu and Contact sections
- Discounted prices are calculated in real-time
- Visual indicators show savings and promo codes
- Responsive design works on all devices

## Security & Performance

### Row Level Security (RLS)
- Public read access to active promos
- Authenticated users can manage promos
- Secure access controls

### Database Indexes
- Optimized queries for active promos
- Fast lookups by promo code
- Efficient date range queries

### Error Handling
- Graceful fallbacks when promos are unavailable
- Loading states and error messages
- Validation for promo data

## Future Enhancements

### Potential Features
1. **Customer Accounts**: Track individual customer usage
2. **Email Notifications**: Alert customers about new promos
3. **Analytics Dashboard**: Track promotion performance
4. **A/B Testing**: Test different promo strategies
5. **Social Media Integration**: Share promos on social platforms
6. **Mobile App**: Native app for promo management
7. **Loyalty Program**: Points-based promotion system

### Technical Improvements
1. **Caching**: Redis cache for frequently accessed promos
2. **Real-time Updates**: WebSocket notifications for promo changes
3. **Advanced Analytics**: Detailed usage and conversion tracking
4. **API Endpoints**: RESTful API for third-party integrations
5. **Webhook Support**: Notify external systems of promo events

## Troubleshooting

### Common Issues

#### Promos Not Showing
1. Check if promos are active (`is_active = true`)
2. Verify date range (current time between start_date and end_date)
3. Ensure usage limits haven't been exceeded
4. Check database permissions

#### Price Calculations Incorrect
1. Verify discount_type is 'percentage' or 'fixed_amount'
2. Check discount_value is a positive number
3. Ensure original price is valid
4. Test calculation function in database

#### Admin Dashboard Issues
1. Check authentication status
2. Verify user has admin permissions
3. Ensure database tables exist
4. Check browser console for errors

### Debug Commands
```sql
-- Check active promos
SELECT * FROM promos WHERE is_active = true AND NOW() BETWEEN start_date AND end_date;

-- Check promo usage
SELECT name, current_uses, max_uses FROM promos WHERE max_uses IS NOT NULL;

-- Test price calculation
SELECT calculate_discounted_price(20.00, 'percentage', 15.00);
```

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Note**: This promo system is designed to be flexible and scalable. It can be easily extended to support additional features like customer segmentation, advanced analytics, and integration with third-party systems. 