
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateFaqInput } from './dto/create-faqs.input';
import { GetFaqArgs } from './dto/get-faq.args';
import { GetFaqsArgs } from './dto/get-faqs.args';
import { UpdateFaqInput } from './dto/update-faqs.input';
import { Faqs } from './entities/faqs.entity';
import faqsJson from './faqs.json';

const faqs = plainToClass(Faqs, faqsJson);
const options = {
  keys: ['slug'],
  threshold: 0.3,
};
const fuse = new Fuse(faqs, options);

@Injectable()
export class FaqsService {
  private faqs: Faqs[] = faqs;

  create({ ...createFaqInput }: CreateFaqInput) {
    const newFaq = {
      id: this.faqs.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
    };
    // TODO: Fix it
    // @ts-ignore
    this.faqs.push(newFaq);
    return newFaq;
  }

  findAll({ text, first, page }: GetFaqsArgs) {
    const startIndex = (page - 1) * first;
    const endIndex = page * first;
    let data: Faqs[] = this.faqs;
    if (text?.replace(/%/g, '')) {
      const formatText = text?.replace(/%/g, '');
      data = fuse.search(formatText)?.map(({ item }) => item);
    }
    const results = data.slice(startIndex, endIndex);
    return {
      data: results,
      paginatorInfo: paginate(this.faqs.length, page, first, this.faqs.length),
    };
  }

  findOne(getFaqArgs: GetFaqArgs) {
    return this.faqs.find(
      (faq) => faq.id === Number(getFaqArgs.id) || faq.slug === getFaqArgs.slug,
    );
  }

  update(id: number, updateFaqInput: UpdateFaqInput) {
    return this.faqs[0];
  }

  remove(id: number) {
    return this.faqs[0];
  }
}

