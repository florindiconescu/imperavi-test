class CreateMembers < ActiveRecord::Migration[5.2]
  def change
    create_table :members do |t|
      t.string :img
      t.string :name
      t.string :bio
      t.string :role

      t.timestamps
    end
  end
end
