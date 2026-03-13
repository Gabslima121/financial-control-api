-- CreateTable
CREATE TABLE "PersonIncome" (
    "id" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonIncome_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PersonIncome" ADD CONSTRAINT "PersonIncome_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
