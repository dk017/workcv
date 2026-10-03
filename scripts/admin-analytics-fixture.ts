import {createHash} from 'node:crypto';
import {ensureAuthTables,ensureAnalyticsTables,ensurePaymentTables,getPool} from '../lib/db.ts';
export async function seedAnalyticsFixture(){
 const url=new URL(process.env.ADMIN_ANALYTICS_TEST_DATABASE_URL||'http://invalid');
 if(url.protocol!=='postgresql:'||url.hostname!=='127.0.0.1'||url.port!=='55439'||url.pathname!=='/analytics_qa'||url.username!=='analytics_qa')throw new Error('Refusing non-isolated database');
 process.env.DATABASE_URL=url.href;
 await ensureAuthTables();await ensureAnalyticsTables();await ensurePaymentTables();const p=getPool();
 await p.query('TRUNCATE workcv_funnel_events,workcv_editor_events,workcv_signup_events,workcv_orders,workcv_payment_checkouts,workcv_users CASCADE');
 await p.query("INSERT INTO workcv_users(id,email,first_visitor_hash) VALUES ('qa_buyer','buyer@example.invalid','visitor-buyer'),('qa_admin','admin@example.invalid','visitor-admin'),('qa_other','other@example.invalid',null)");
 let id=0;
 async function event(visitor:string,session:string,user:string|null,name:string,path:string,source:string,minutes:number,isTest=false){await p.query("INSERT INTO workcv_funnel_events(event_id_hash,visitor_hash,session_hash,user_id,event_name,path,source,source_normalized,medium,campaign,device_class,is_test,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$7,'referral','uk_cv_guide','desktop',$8,NOW()-$9*interval '1 minute')",['qa_'+(++id),visitor,session,user,name,path,source,isTest,minutes]);}
 await event('visitor-buyer','buyer-session','qa_buyer','landing_view','/cv-guide','careercloud',55);
 await event('visitor-buyer','buyer-session','qa_buyer','page_view','/cv-guide','careercloud',54);
 await event('visitor-buyer','buyer-session','qa_buyer','page_view','/pricing','careercloud',4);
 await event('visitor-return','return-session','qa_buyer','landing_view','/','google',40);
 await event('visitor-unknown','unknown-session',null,'landing_view','/ats-checker','linkedin',2);
 await event('visitor-admin','admin-session','qa_admin','landing_view','/','direct',1);
 await event('visitor-private','private-session',null,'page_view','/admin/analytics','direct',1);
 await event('visitor-test','test-session',null,'landing_view','/','direct',1,true);
 await p.query("INSERT INTO workcv_cv_documents(id,user_id,data,created_at) VALUES('qa_cv','qa_buyer','{\"private_cv_text\":\"DO_NOT_INCLUDE\"}',NOW()-interval '45 minutes')");
 for(const name of ['editor_viewed','preview_ready','checkout_sheet_opened','checkout_plan_selected','payment_started','pdf_downloaded'])await p.query("INSERT INTO workcv_editor_events(user_id,event_name,metadata,created_at) VALUES('qa_buyer',$1,'{\"plan\":\"pass\"}',NOW()-interval '20 minutes')",[name]);
 await p.query("INSERT INTO workcv_orders(id,draft_id,user_id,product_id,amount_cents,currency,is_test,attribution_source,attribution_campaign,attribution_captured_at,paid_at,refunded_at) VALUES ('qa_pass','qa_cv','qa_buyer','pdt_0NoafhI03VVtoLtkpGLHe',2499,'GBP',false,'careercloud','uk_cv_guide',NOW(),NOW()-interval '15 minutes',null),('qa_usd','qa_cv','qa_buyer','pdt_0NgvxNXDilMTh3bpfLPq2',799,'USD',false,null,null,null,NOW()-interval '10 minutes',NOW()),('qa_test','qa_cv','qa_buyer','cv',799,'GBP',true,null,null,null,NOW(),null),('qa_operator','qa_cv','qa_admin','cv',799,'GBP',false,null,null,null,NOW(),null),('qa_free','qa_cv','qa_other','cv',0,'GBP',false,null,null,null,NOW(),null)");
 for(const [user,token] of [['qa_admin','synthetic-admin-token'],['qa_other','synthetic-customer-token']])await p.query("INSERT INTO workcv_sessions(token_hash,user_id,expires_at) VALUES($1,$2,NOW()+interval '1 day')",[createHash('sha256').update('analytics-local-qa-secret:'+token).digest('hex'),user]);
 return p;
}
