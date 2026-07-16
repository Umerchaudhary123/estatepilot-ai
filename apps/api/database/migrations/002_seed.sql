create schema if not exists estatepilot;
set search_path to estatepilot, public;

insert into organizations(id,name,slug) values('org-demo','EstatePilot Demo Realty','estatepilot-demo') on conflict do nothing;

insert into agents(id,organization_id,name,title,phone,territories) values
('agent-areeba','org-demo','Areeba Khan','Senior Property Advisor','+92 300 555 0192',array['DHA Lahore','Gulberg']),
('agent-hamza','org-demo','Hamza Siddiqui','Islamabad Area Specialist','+92 321 555 0144',array['Islamabad']),
('agent-sara','org-demo','Sara Ahmed','Karachi Residential Lead','+92 333 555 0188',array['Karachi'])
on conflict do nothing;

insert into properties(id,organization_id,slug,title,description,purpose,property_type,city,area,address,latitude,longitude,price,price_label,bedrooms,bathrooms,size,size_unit,furnished,amenities,status,verified,featured,match_score,agent_id) values
('prop-001','org-demo','serene-villa-dha-phase-6-lahore','Serene Designer Villa','Light-filled designer residence with landscaped courtyard.','buy','house','Lahore','DHA Phase 6','CCA Block, DHA Phase 6, Lahore',31.4697,74.4525,68500000,'PKR 6.85 Crore',5,6,1,'Kanal',true,array['Smart home','Solar power','Home theatre','2-car parking'],'available',true,true,96,'agent-areeba'),
('prop-002','org-demo','furnished-apartment-blue-area-islamabad','Skyline Furnished Apartment','Fully furnished city apartment with Margalla views.','rent','apartment','Islamabad','Blue Area','Jinnah Avenue, Blue Area, Islamabad',33.7104,73.0551,145000,'PKR 1.45 Lakh / month',2,2,1250,'Sq. Ft.',true,array['Furnished','Backup power','Elevator','Gym'],'available',true,true,94,'agent-hamza'),
('prop-003','org-demo','family-home-bahria-town-karachi','Parkside Family Home','Calm park-facing family home with modern kitchen.','buy','house','Karachi','Bahria Town','Precinct 10-A, Bahria Town Karachi',25.0274,67.3038,34500000,'PKR 3.45 Crore',4,5,350,'Sq. Yd.',false,array['Park facing','Community club','Solar ready'],'available',true,false,89,'agent-sara'),
('prop-004','org-demo','modern-flat-gulberg-lahore','Gulberg Urban Loft','Refined three-bedroom loft in central Lahore.','rent','apartment','Lahore','Gulberg III','MM Alam Road, Gulberg III, Lahore',31.5102,74.3441,220000,'PKR 2.2 Lakh / month',3,3,1800,'Sq. Ft.',true,array['Furnished','Rooftop lounge','Gym'],'available',true,true,91,'agent-areeba'),
('prop-005','org-demo','margalla-view-house-f-8-islamabad','Margalla View Residence','Architect-designed residence with mountain views.','buy','house','Islamabad','F-8','Street 32, F-8/1, Islamabad',33.7249,73.0393,145000000,'PKR 14.5 Crore',6,7,1,'Kanal',false,array['Mountain view','Basement','Elevator','Solar'],'available',true,true,93,'agent-hamza'),
('prop-006','org-demo','sea-view-apartment-clifton-karachi','Clifton Sea View Suite','High-floor apartment with uninterrupted sea views.','rent','apartment','Karachi','Clifton Block 2','Marine Promenade, Clifton, Karachi',24.8138,67.0306,325000,'PKR 3.25 Lakh / month',3,4,2400,'Sq. Ft.',true,array['Sea view','Furnished','Pool','Gym'],'available',true,false,88,'agent-sara')
on conflict do nothing;

insert into leads(id,organization_id,name,email,phone,purpose,budget,preferred_area,score,temperature,stage,source,assigned_agent_id) values
('lead-001','org-demo','Usman Tariq','usman@example.com','+92 301 234 5678','buy','PKR 6–8 Crore','DHA Lahore',88,'hot','viewing','AI assistant','agent-areeba'),
('lead-002','org-demo','Maham Ali','maham@example.com','+92 333 888 9021','rent','PKR 1.5 Lakh/mo','Blue Area',76,'hot','qualified','Website','agent-hamza'),
('lead-003','org-demo','Bilal Raza','bilal@example.com','+92 312 555 7665','buy','PKR 3–4 Crore','Bahria Karachi',61,'warm','new','Referral','agent-sara')
on conflict do nothing;

insert into appointments(id,organization_id,property_id,lead_id,lead_name,agent_name,viewing_date,viewing_time,viewing_type,status) values
('apt-001','org-demo','prop-001','lead-001','Usman Tariq','Areeba Khan','2026-07-16','11:30 AM','physical','confirmed'),
('apt-002','org-demo','prop-002','lead-002','Maham Ali','Hamza Siddiqui','2026-07-16','3:00 PM','virtual','confirmed')
on conflict do nothing;

insert into subscriptions(organization_id,plan,status,usage) values('org-demo','portfolio','active','{"ai_requests":128,"storage_gb":1.2}') on conflict(organization_id) do update set usage=excluded.usage;
