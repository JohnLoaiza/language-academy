
import { useEffect, useState } from "react";
import './index.css';
import { CategoriesList } from "./components/categoriesList";
import { CoursesList } from "./components/coursesList";
import { GroupsList } from "./components/groupsList";
import {CategoriesResponse } from "../../models/backlessResponse";
import { Course } from "../../models/courseCategory";
import { useManagmentController } from "./controllers/useManagmentController";

export const Management = () => {
  const [categories, setCategories] = useState<CategoriesResponse[] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesResponse | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const {getCategories} = useManagmentController()

  useEffect(() => {
    if (!categories) {
      fetchCategories ();
    }
  }, []);

  const fetchCategories  = async () => {
    setCategories(await getCategories());
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


