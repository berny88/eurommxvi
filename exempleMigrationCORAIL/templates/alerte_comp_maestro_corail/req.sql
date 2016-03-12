insert into comp_corailmaestro (reference, corail_usine, corail_minimale, maestro_rupture, maestro_dotation) values

select * from alerte_corail where reference in (select reference from product)

select product.id, product.reference, product.designation, 
alerte_corail.date_rupture_usine, alerte_maestro.date_rupture, 
alerte_corail.date_rupture_minimale, alerte_maestro.date_rupture_dotation_atelier
from product 
inner join alerte_corail on product.reference=alerte_corail.reference
left join alerte_maestro on alerte_corail.reference=alerte_maestro.reference
order by product.reference


INSERT INTO alerte_comp_maestro_corail (reference, designation, date_rupture_maestro, date_rupture_corail, date_rupture_dotation_atelier_maestro, date_rupture_minimale_corail) 
SELECT product.reference, product.designation, alerte_maestro.date_rupture, alerte_corail.date_rupture_usine, alerte_maestro.date_rupture_dotation_atelier, alerte_corail.date_rupture_minimale
FROM product 
INNER JOIN alerte_maestro ON product.reference=alerte_maestro.reference
LEFT JOIN alerte_corail ON alerte_maestro.reference=alerte_corail.reference
ORDER BY product.reference