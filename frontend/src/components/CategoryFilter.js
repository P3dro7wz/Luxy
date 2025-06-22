import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            selectedCategory === category.id
              ? 'bg-black text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-75">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;