
import { useEffect, useState } from "react";
import './index.css';
import { dbConnect } from "../../db";
import { CategoriesList } from "./components/categoriesList";
import { CoursesList } from "./components/coursesList";
import { GroupsList } from "./components/groupsList";
import { Collections } from "../../db/collections";
import {CategoriesResponse } from "../../models/backlessResponse";
import { Course } from "../../models/courseCategory";

export const Management = () => {
  const [categories, setCategories] = useState<CategoriesResponse[] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesResponse | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!categories) {
      getCategories();
    }
  }, []);

  const getCategories = async () => {
    setCategories((await dbConnect()?.getCollection(Collections.CATEGORIES))?.map(c => c) as CategoriesResponse[]);
  };

  return (
    <div className="" style={{width: '75vw'}}>
      {
        !selectedCategory ? (
          <CategoriesList 
            categories={categories} 
            onSelectCategory={setSelectedCategory}
          />
        ) : !selectedCourse ? (
          <CoursesList 
            category={selectedCategory} 
            onBack={() => setSelectedCategory(null)} 
            onSelectCourse={setSelectedCourse}
          />
        ) : (
          <GroupsList
          category={selectedCategory}  
            course={selectedCourse} 
            onBack={() => setSelectedCourse(null)}
          />
        )}
    </div>
  );
};


