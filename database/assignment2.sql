TRUNCATE TABLE public.account RESTART IDENTITY;

INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1; 

DELETE FROM public.account 
WHERE account_id = 1;

UPDATE public.inventory
Set inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT inv_make, inv_model FROM public.inventory inv
    INNER JOIN public.classification cl
    ON inv.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';

UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' AND inv_thumbnail LIKE '/images/%';
