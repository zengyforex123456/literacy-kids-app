-- V1.0 付费系统数据库
-- 执行方式: Supabase Dashboard → SQL Editor → 粘贴执行

-- 1. 购买记录表
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,        -- 'full_unlock' | 'pack_201_300'
  payment_method text,             -- 'wechat' | 'alipay'
  transaction_id text UNIQUE,      -- 支付平台返回，幂等去重
  token_hash text NOT NULL,        -- sha256(user_id+product_id+salt)
  created_at timestamptz DEFAULT now()
);

-- 2. 进度快照表
CREATE TABLE IF NOT EXISTS progress_snapshots (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id text DEFAULT 'child_1',
  learned_chars text[] DEFAULT '{}',
  last_sync_at timestamptz DEFAULT now(),
  device_id text,
  PRIMARY KEY (user_id, profile_id)
);

-- 3. 纠错反馈表
CREATE TABLE IF NOT EXISTS corrections (
  id serial PRIMARY KEY,
  radical text NOT NULL,
  target_char text NOT NULL,
  issue text,
  submitted_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false
);

-- 4. RLS 策略
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_purchases" ON purchases
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_progress" ON progress_snapshots
  FOR ALL USING (auth.uid() = user_id);

-- 5. 索引
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_token ON purchases(token_hash);
