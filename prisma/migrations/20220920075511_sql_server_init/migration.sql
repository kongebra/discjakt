BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Store] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [baseUrl] NVARCHAR(1000) NOT NULL,
    [sitemapUrl] NVARCHAR(1000) NOT NULL,
    [created] DATETIME2 NOT NULL CONSTRAINT [Store_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2 NOT NULL,
    CONSTRAINT [Store_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Store_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [loc] NVARCHAR(1000) NOT NULL,
    [lastmod] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [imageUrl] NVARCHAR(1000) NOT NULL,
    [storeId] INT NOT NULL,
    [created] DATETIME2 NOT NULL CONSTRAINT [Product_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2 NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Product_loc_key] UNIQUE NONCLUSTERED ([loc])
);

-- CreateTable
CREATE TABLE [dbo].[ProductPrice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [amount] NVARCHAR(1000) NOT NULL,
    [currency] NVARCHAR(1000) NOT NULL,
    [created] DATETIME2 NOT NULL CONSTRAINT [ProductPrice_created_df] DEFAULT CURRENT_TIMESTAMP,
    [productId] INT NOT NULL,
    CONSTRAINT [ProductPrice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_storeId_fkey] FOREIGN KEY ([storeId]) REFERENCES [dbo].[Store]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProductPrice] ADD CONSTRAINT [ProductPrice_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
