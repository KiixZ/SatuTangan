import { v4 as uuidv4 } from 'uuid';
import databaseService from './databaseService';
import { RowDataPacket } from 'mysql2';

interface Category extends RowDataPacket {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  sdgs_ref: string | null;
  created_at: Date;
  updated_at: Date;
}

interface CreateCategoryData {
  name: string;
  description?: string;
  icon_url?: string;
  sdgs_ref?: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon_url?: string;
  sdgs_ref?: string;
}

export class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    const categories = await databaseService.query<Category>(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return categories;
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    const categories = await databaseService.query<Category>(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );
    return categories.length > 0 ? categories[0] : null;
  }

  /**
   * Create new category
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const { name, description, icon_url, sdgs_ref } = data;

    // Check if category name already exists
    const existingCategories = await databaseService.query<Category>(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategories.length > 0) {
      throw new Error('Category name already exists');
    }

    // Create category
    const categoryId = uuidv4();
    await databaseService.execute(
      `INSERT INTO categories (id, name, description, icon_url, sdgs_ref)
       VALUES (?, ?, ?, ?, ?)`,
      [categoryId, name, description || null, icon_url || null, sdgs_ref || null]
    );

    // Return created category
    const category = await this.getCategoryById(categoryId);
    if (!category) {
      throw new Error('Failed to create category');
    }

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, data: UpdateCategoryData): Promise<Category> {
    // Check if category exists
    const existingCategory = await this.getCategoryById(categoryId);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if new name conflicts with existing category
    if (data.name && data.name !== existingCategory.name) {
      const conflictingCategories = await databaseService.query<Category>(
        'SELECT id FROM categories WHERE name = ? AND id != ?',
        [data.name, categoryId]
      );

      if (conflictingCategories.length > 0) {
        throw new Error('Category name already exists');
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description || null);
    }
    if (data.icon_url !== undefined) {
      updates.push('icon_url = ?');
      values.push(data.icon_url || null);
    }
    if (data.sdgs_ref !== undefined) {
      updates.push('sdgs_ref = ?');
      values.push(data.sdgs_ref || null);
    }

    if (updates.length === 0) {
      return existingCategory;
    }

    values.push(categoryId);

    // Update category
    await databaseService.execute(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Return updated category
    const updatedCategory = await this.getCategoryById(categoryId);
    if (!updatedCategory) {
      throw new Error('Failed to update category');
    }

    return updatedCategory;
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string): Promise<void> {
    // Check if category exists
    const existingCategory = await this.getCategoryById(categoryId);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if category is being used by any campaigns
    const campaigns = await databaseService.query<RowDataPacket>(
      'SELECT id FROM campaigns WHERE category_id = ? LIMIT 1',
      [categoryId]
    );

    if (campaigns.length > 0) {
      throw new Error('Cannot delete category that is being used by campaigns');
    }

    // Delete category
    await databaseService.execute(
      'DELETE FROM categories WHERE id = ?',
      [categoryId]
    );
  }

  /**
   * Check if category is being used
   */
  async isCategoryInUse(categoryId: string): Promise<boolean> {
    const campaigns = await databaseService.query<RowDataPacket>(
      'SELECT id FROM campaigns WHERE category_id = ? LIMIT 1',
      [categoryId]
    );

    return campaigns.length > 0;
  }
}

export default new CategoryService();
