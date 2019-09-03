class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :edit, :update]
  def index
    @articles = Article.all
  end

  def show
  end

  def new
    @article = Article.new
  end

  def create
    @article = Article.new(article_params)
    if @article.save
      redirect_to articles_path
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    @article.update(article_params)
    redirect_to articles_path
  end

  private

  def set_article
    @articles = Article.find(params[:id])
  end

  def article_params
    params.require(:article).permit(:title, :rich_text, :date, :published, :read_time)
  end

end
