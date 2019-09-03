class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :rich_text
      t.date :date
      t.boolean :published
      t.integer :read_time
      t.references :member, foreign_key: true

      t.timestamps
    end
  end
end
